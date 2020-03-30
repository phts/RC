const robot = require('optional')('robotjs')

module.exports = async function key(action) {
  const {key} = action
  if (!key) {
    return false
  }
  if (!robot) {
    console.warn('"robotjs" is not installed. Keyboard actions are not supported.')
    return true
  }

  if (Array.isArray(key)) {
    const modifiers = [...key]
    const k = modifiers.pop()
    await robot.keyTap(k, modifiers)
  } else if (typeof key === 'string') {
    await robot.keyTap(key)
  } else {
    throw new Error('"key" must be a string or an array')
  }

  return true
}
