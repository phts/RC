'use strict'

const handlers = require('./handlers')

async function runAction(action) {
  return handlers(action)
}

module.exports = async function run(actions) {
  if (!Array.isArray(actions)) {
    actions = [actions]
  }
  for (const act of actions) {
    await runAction(act)
  }
}
