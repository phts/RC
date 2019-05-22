'use strict'

const {execFileSync} = require('child_process')

module.exports = function exec(action) {
  const {exec} = action
  if (!exec) {
    return false
  }

  const [app, ...args] = exec
  execFileSync(app, args)
  return true
}
