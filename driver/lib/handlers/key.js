'use strict'

const ks = require('node-key-sender')

module.exports = async function key(action) {
  const {key} = action
  if (!key) {
    return false
  }

  if (typeof key !== 'string') {
    throw new Error('"key" must be a string')
  }
  await ks.sendKey(key)
  return true
}
