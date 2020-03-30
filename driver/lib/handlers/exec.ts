import {execFileSync} from 'child_process'

module.exports = function exec(action) {
  const {exec} = action
  if (!exec) {
    return false
  }

  if (Array.isArray(exec)) {
    const [app, ...args] = exec
    execFileSync(app, args)
  } else if (typeof exec === 'string') {
    execFileSync(exec)
  } else {
    throw new Error('"exec" must be a string or an array')
  }

  return true
}
