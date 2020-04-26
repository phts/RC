'use strict'

const SETTINGS_PATH = require('path').resolve(__dirname, '../settings.json')

const initialSettings = require('cjson').load(SETTINGS_PATH)

if (!initialSettings.serialPort) {
  throw new Error('serialPort is required')
}
if (!initialSettings.mappings) {
  throw new Error('mappings is required')
}

const DEFAULT_SETTINGS = {
  debounceDelay: 150,
  initialState: null,
  noDebounce: [],
}

module.exports = {
  getInitialSettings() {
    return Object.assign({}, DEFAULT_SETTINGS, initialSettings)
  },
  getMappings() {
    return require('cjson').load(SETTINGS_PATH).mappings
  },
}
