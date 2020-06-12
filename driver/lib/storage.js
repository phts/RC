'use strict'

const debug = require('./debug')

let storage = null

function isSameValues(newValues) {
  if (!storage) {
    return false
  }
  return JSON.stringify(storage.values) === JSON.stringify(newValues)
}

function initStorage(values) {
  storage = {current: -1, values}
}

function setValues(values) {
  if (!isSameValues(values)) {
    initStorage(values)
  }
}

function toggleNextValue() {
  const nextIndex = (storage.current + 1) % storage.values.length
  storage.current = nextIndex
  debug.internal('state: ', getCurrentValue())
}

function getCurrentValue() {
  return storage.values[storage.current]
}

module.exports = {
  getCurrentValue,
  setValues,
  toggleNextValue,
}
