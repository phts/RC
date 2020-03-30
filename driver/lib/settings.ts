import rawSettings from '../settings.json'

if (!rawSettings.serialPort) {
  throw new Error('serialPort is required')
}

const DEFAULT_SETTINGS = {
  debounceDelay: 150,
  noDebounce: [],
  mappings: {},
}

export default Object.assign({}, DEFAULT_SETTINGS, rawSettings)
