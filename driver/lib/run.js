'use strict'

const {execFileSync} = require('child_process')
const ks = require('node-key-sender')
const psList = require('ps-list')

const SUPPORTED_IF_OPERATORS = ['running']
const OPERATOR_FN = {
  running: async operand => !!(await psList()).find(x => x.name === operand),
}

async function run(actions) {
  if (!Array.isArray(actions)) {
    actions = [actions]
  }
  for (const act of actions) {
    await runAction(act)
  }
}

async function runIf(action) {
  if (!action.then) {
    throw new Error('"then" is required for "if" statement')
  }
  for (const operator of SUPPORTED_IF_OPERATORS) {
    const operand = action.if[operator]
    if (typeof operand === 'undefined') {
      continue
    }

    const operatorFn = OPERATOR_FN[operator]
    const result = await operatorFn(operand)
    if (result) {
      return run(action.then)
    } else if (action.else) {
      return run(action.else)
    }

    return
  }
  throw new Error('"if" must use any of supported operators: ' + SUPPORTED_IF_OPERATORS.join(','))
}

async function runAction(action) {
  if (action.if) {
    return runIf(action)
  }

  const {exec, key} = action
  if (exec) {
    const [app, ...args] = exec
    execFileSync(app, args)
    return
  }
  if (key) {
    if (typeof key !== 'string') {
      throw new Error('"key" must be a string')
    }
    ks.sendKey(key)
    return
  }
}

module.exports = run
