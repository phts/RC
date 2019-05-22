'use strict'

const {execFileSync} = require('child_process')
const ks = require('node-key-sender')

async function runAction(action) {
  const {exec, key} = action
  if (exec) {
    const [app, ...args] = exec
    execFileSync(app, args)
    return
  }
  if (key) {
    if (typeof key !== 'string') {
      throw new Error('key must be a string')
    }
    ks.sendKey(key)
    return
  }
}

module.exports = async function run(actions) {
  if (!Array.isArray(actions)) {
    actions = [actions]
  }
  for (const act of actions) {
    await runAction(act)
  }
}
