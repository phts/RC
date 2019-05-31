'use strict'

let robot
try {
  robot = require('robotjs')
} catch (er) {
  console.warn('"robotjs" is not installed. Mouse actions are not supported.')
  robot = null
}

const MOUSE_FNS = {
  click: button => robot.mouseClick(button),
  delay: delay => robot.setMouseDelay(delay),
  move: coords => robot.moveMouse(coords[0], coords[1]),
  moveSmooth: coords => robot.moveMouseSmooth(coords[0], coords[1]),
}

function runMouseAction(mouseAction) {
  for (const operator in MOUSE_FNS) {
    const operatorArgs = mouseAction[operator]
    if (typeof operatorArgs !== 'undefined') {
      const operatorFn = MOUSE_FNS[operator]
      operatorFn(operatorArgs)
      return
    }
  }

  throw new Error(
    '"mouse" must contain any of supported actions: ' + Object.keys(MOUSE_FNS).join(', '),
  )
}

module.exports = function mouse(action) {
  const {mouse} = action
  if (!mouse) {
    return false
  }

  if (!robot) {
    return true
  }

  let mouseActions = mouse

  if (!Array.isArray(mouseActions)) {
    mouseActions = [mouseActions]
  }

  for (const act of mouseActions) {
    runMouseAction(act)
  }

  return true
}
