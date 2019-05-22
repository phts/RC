'use strict'

const {execFileSync} = require('child_process')

module.exports = function exec(action) {
  const {exec} = action
  if (!exec) {
    return false
  }

  if (Array.isArray(exec)) {
    const [app, ...args] = exec
    execFileSync(app, args)
  } else {
    execFileSync(exec)
  }

  return true
}
