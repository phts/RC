'use strict'

const operators = require('require-directory')(module, './if-operators')

module.exports = async function handleIf(action, ...otherArgs) {
  if (!action.if) {
    return false
  }
  if (!action.then) {
    throw new Error('"then" is required for "if" statement')
  }
  for (const operator in operators) {
    const operand = action.if[operator]
    if (typeof operand === 'undefined') {
      continue
    }

    const fn = operators[operator]
    const result = await fn(operand)
    const run = require('../run')
    if (result) {
      return run(action.then, ...otherArgs)
    } else if (action.else) {
      return run(action.else, ...otherArgs)
    }

    return true
  }
  throw new Error('"if" must use any of supported operators: ' + Object.keys(operators).join(', '))
}
