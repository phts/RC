'use strict'

const SETTINGS_PATH = require('path').resolve(__dirname, '../settings.json')

const rawSettings = require('cjson').load(SETTINGS_PATH)

if (!rawSettings.serialPort) {
  throw new Error('serialPort is required')
}
if (!rawSettings.mappings) {
  throw new Error('mappings is required')
}

const DEFAULT_SETTINGS = {
  debounceDelay: 150,
  initialState: null,
  noDebounce: [],
}

module.exports = Object.assign({}, DEFAULT_SETTINGS, rawSettings)
