'use strict'

const robot = require('optional')('robotjs')

function cyclicCoords(x, y) {
  const screenSize = robot.getScreenSize()
  if (x > screenSize.width) {
    x = x - screenSize.width
  }
  if (y >= screenSize.height) {
    y = y - screenSize.height
  }
  return [x, y]
}

const MOUSE_FNS = {
  click: (button) => robot.mouseClick(button),
  delay: (delay) => robot.setMouseDelay(delay),
  doubleClick: (button) => robot.mouseClick(button, true),
  move: (coords) => robot.moveMouse(coords[0], coords[1]),
  moveSmooth: (coords) => robot.moveMouseSmooth(coords[0], coords[1]),
  moveRelative: (coords) => {
    const pos = robot.getMousePos()
    robot.moveMouse(...cyclicCoords(pos.x + coords[0], pos.y + coords[1]))
  },
  moveRelativeSmooth: (coords) => {
    const pos = robot.getMousePos()
    robot.moveMouseSmooth(...cyclicCoords(pos.x + coords[0], pos.y + coords[1]))
  },
  scroll: (distance) => robot.scrollMouse(0, distance),
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
    '"mouse" must contain any of supported actions: ' + Object.keys(MOUSE_FNS).join(', ')
  )
}

module.exports = function mouse(action) {
  const {mouse} = action
  if (!mouse) {
    return false
  }
  if (!robot) {
    console.warn('"robotjs" is not installed. Mouse actions are not supported.')
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
