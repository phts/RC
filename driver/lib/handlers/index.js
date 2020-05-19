'use strict'

const handlers = require('require-directory')(module, {recurse: false})

async function runHandlers(action, writeToSerial) {
  for (const k in handlers) {
    const handled = await handlers[k](action, writeToSerial)
    if (handled) {
      return true
    }
  }
}

module.exports = runHandlers
