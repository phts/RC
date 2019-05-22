'use strict'

const handlers = require('require-directory')(module)

async function runHandlers(action) {
  for (const k in handlers) {
    const handled = await handlers[k](action)
    if (handled) {
      return true
    }
  }
}

module.exports = runHandlers
