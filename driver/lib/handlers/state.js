'use strict'

const storage = require('../storage')

module.exports = function state(action) {
  const {state: values} = action
  if (!Array.isArray(values)) {
    return false
  }

  storage.setValues(values)
  storage.toggleNextValue()
  return true
}
