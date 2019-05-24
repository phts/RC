'use strict'

const rawSettings = require('../settings.json')

if (!rawSettings.serialPort) {
  throw new Error('serialPort is required')
}

const DEFAULT_SETTINGS = {
  debounceDelay: 150,
  mappings: {},
}

module.exports = Object.assign({}, DEFAULT_SETTINGS, rawSettings)
