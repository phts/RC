'use strict'

const runHandlers = require('./handlers')

module.exports = async function run(actions) {
  if (!Array.isArray(actions)) {
    actions = [actions]
  }
  for (const act of actions) {
    await runHandlers(act)
  }
}
