'use strict'

const ks = require('node-key-sender')

module.exports = async function key(action) {
  const {key} = action
  if (!key) {
    return false
  }

  if (Array.isArray(key)) {
    await ks.sendCombination(key)
  } else if (typeof key === 'string') {
    await ks.sendKey(key)
  } else {
    throw new Error('"key" must be a string or an array')
  }

  return true
}
