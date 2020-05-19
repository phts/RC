'use strict'

const runHandlers = require('./handlers')

module.exports = async function run(actions, writeToSerial) {
  if (!Array.isArray(actions)) {
    actions = [actions]
  }
  for (const a of actions) {
    await runHandlers(a, writeToSerial)
  }
}
