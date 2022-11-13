'use strict'

const debug = require('./debug')

const storage = {current: null, values: []}

function setValues(values) {
  storage.values = values
}

function getCurrentValue() {
  return storage.values.find((x) => x === storage.current)
}

function toggleNextValue() {
  const currentIndex = storage.values.findIndex((x) => x === storage.current)
  const nextIndex = (currentIndex + 1) % storage.values.length
  storage.current = storage.values[nextIndex]
  debug.internal('state: ', getCurrentValue())
}

module.exports = {
  getCurrentValue,
  setValues,
  toggleNextValue,
}
