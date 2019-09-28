'use strict'

const psList = require('ps-list')

const OPERATOR_FNS = {
  running: async operand => !!(await psList()).find(x => x.name === operand),
}

module.exports = async function handleIf(action) {
  if (!action.if) {
    return false
  }
  if (!action.then) {
    throw new Error('"then" is required for "if" statement')
  }
  for (const operator in OPERATOR_FNS) {
    const operand = action.if[operator]
    if (typeof operand === 'undefined') {
      continue
    }

    const operatorFn = OPERATOR_FNS[operator]
    const result = await operatorFn(operand)
    const run = require('../run')
    if (result) {
      return run(action.then)
    } else if (action.else) {
      return run(action.else)
    }

    return true
  }
  throw new Error(
    '"if" must use any of supported operators: ' + Object.keys(OPERATOR_FNS).join(', ')
  )
}
