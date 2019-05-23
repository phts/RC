'use strict'

const debounce = require('debounce')
const settings = require('./settings.json')
const run = require('./lib/run')
const SerialPortReader = require('./lib/SerialPortReader')

const handle = debounce(
  async button => {
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
  },
  settings.debounceDelay || 150,
  true,
)

const reader = new SerialPortReader(settings.serialPort)
reader.start(handle)
