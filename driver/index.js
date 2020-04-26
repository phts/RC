'use strict'

const debounce = require('debounce')
const {getInitialSettings, getMappings} = require('./lib/settings')
const run = require('./lib/run')
const SerialPortReader = require('./lib/SerialPortReader')
const storage = require('./lib/storage')

const settings = getInitialSettings()

const simpleHandle = async (button, writeToSerial) => {
  const actions = getMappings()[button]
  if (!actions) {
    console.warn(`Action not found for remote control button "${button}"`)
    return
  }

  try {
    await run(actions, writeToSerial)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

const debouncedHandle = debounce(simpleHandle, settings.debounceDelay, true)

const callHandleFn = (button, writeToSerial) => {
  const fn = settings.noDebounce.includes(button) ? simpleHandle : debouncedHandle
  return fn(button, writeToSerial)
}

if (settings.initialState) {
  storage.setValues([settings.initialState])
  storage.toggleNextValue()
}

const reader = new SerialPortReader(settings.serialPort)
reader.start(callHandleFn)
