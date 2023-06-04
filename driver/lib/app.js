'use strict'

const debounce = require('debounce')
const {getMappings} = require('./settings')
const run = require('./run')
const SerialPortReader = require('./SerialPortReader')
const storage = require('./storage')
const {PING, PONG, FIRMWARE_DEBUG} = require('./constants')
const debug = require('./debug')

function app(settings) {
  let lastPing = new Date()

  if (settings.debug) {
    debug.enable()
  }

  const simpleHandle = (button, writeToSerial) => {
    const actions = getMappings()[button]
    if (!actions) {
      console.warn(`Action not found for remote control button "${button}"`)
      return
    }

    run(actions, writeToSerial).catch((e) => {
      console.error(e.message)
      process.exit(1)
    })
  }

  const debouncedHandle = debounce(simpleHandle, settings.debounceDelay, true)

  const callHandleFn = (button, writeToSerial) => {
    debug.input(button)
    if (button.startsWith(FIRMWARE_DEBUG)) {
      return
    }
    if (button === PING) {
      writeToSerial(PONG)
      lastPing = new Date()
      return
    }
    const fn = settings.noDebounce.includes(button) ? simpleHandle : debouncedHandle
    return fn(button, writeToSerial)
  }

  if (settings.appTimeout) {
    setInterval(() => {
      if (new Date().getTime() - lastPing.getTime() > settings.appTimeout) {
        process.exit(1)
      }
    }, settings.appTimeout / 5)
  }

  if (settings.initialState) {
    storage.setValues([settings.initialState])
    storage.toggleNextValue()
  }

  const reader = new SerialPortReader(settings.serialPort)
  reader.start(callHandleFn)
}

module.exports = app
