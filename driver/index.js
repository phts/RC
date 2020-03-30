'use strict'

const debounce = require('debounce')
const settings = require('./lib/settings')
const run = require('./lib/run')
const SerialPortReader = require('./lib/SerialPortReader')

const simpleHandle = async (button) => {
  const actions = settings.mappings[button]
  if (!actions) {
    console.warn(`Action not found for remote control button "${button}"`)
    return
  }

  try {
    await run(actions)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

const debouncedHandle = debounce(simpleHandle, settings.debounceDelay, true)

const callHandleFn = (button) => {
  return (settings.noDebounce.includes(button) ? simpleHandle : debouncedHandle)(button)
}

const reader = new SerialPortReader(settings.serialPort)
reader.start(callHandleFn)
