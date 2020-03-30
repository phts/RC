'use strict'

const {execFileSync} = require('child_process')
const psList = require('ps-list')
const robot = require('robotjs')

const run = require('../../lib/run')

jest.mock('ps-list', () => jest.fn(async () => {}))
jest.mock('robotjs', () => ({
  keyTap: jest.fn(),
  mouseClick: jest.fn(),
  moveMouse: jest.fn(),
  moveMouseSmooth: jest.fn(),
  setMouseDelay: jest.fn(),
}))
jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}))

describe('run', () => {
  let actions

  beforeEach(() => {
    execFileSync.mockClear()
    psList.mockReset()
    robot.keyTap.mockClear()
    robot.mouseClick.mockClear()
    robot.moveMouse.mockClear()
    robot.moveMouseSmooth.mockClear()
    robot.setMouseDelay.mockClear()
  })

  describe('when "exec" action', () => {
    it('executes the specified file without args (as array)', async () => {
      actions = {
        exec: ['app'],
      }
      await run(actions)

      expect(robot.keyTap).not.toHaveBeenCalled()
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', [])
    })

    it('executes the specified file without args (as string)', async () => {
      actions = {
        exec: 'app',
      }
      await run(actions)

      expect(robot.keyTap).not.toHaveBeenCalled()
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app')
    })

    it('executes the specified file with args', async () => {
      actions = {
        exec: ['app', 'arg1', 'arg2'],
      }
      await run(actions)

      expect(robot.keyTap).not.toHaveBeenCalled()
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', ['arg1', 'arg2'])
    })

    it('rejects if "exec" has wrong type', async () => {
      actions = {
        exec: {wrong: 'type'},
      }

      await expect(run(actions)).rejects.toThrow('"exec" must be a string or an array')
    })
  })

  describe('when "key" action', () => {
    it('sends the specified key press if passed string', async () => {
      actions = {
        key: 'space',
      }
      await run(actions)

      expect(execFileSync).not.toHaveBeenCalled()
      expect(robot.keyTap).toHaveBeenCalledTimes(1)
      expect(robot.keyTap).toHaveBeenCalledWith('space')
    })

    it('sends the specified key combination if passed array', async () => {
      actions = {
        key: ['shift', 'space'],
      }
      await run(actions)

      expect(execFileSync).not.toHaveBeenCalled()
      expect(robot.keyTap).toHaveBeenCalledTimes(1)
      expect(robot.keyTap).toHaveBeenCalledWith('space', ['shift'])
    })

    it('rejects if "key" has wrong type', async () => {
      actions = {
        key: {wrong: 'type'},
      }

      await expect(run(actions)).rejects.toThrow('"key" must be a string or an array')
    })
  })

  describe('when "if" action', () => {
    it('rejects if no "then"', async () => {
      actions = {
        if: {running: 'app.exe'},
      }
      await expect(run(actions)).rejects.toThrow('"then" is required for "if" statement')
    })

    it('rejects if operator is not supported', async () => {
      actions = {
        if: {notSupportedOperator: 'app.exe'},
        then: {key: 'space'},
      }
      await expect(run(actions)).rejects.toThrow(
        '"if" must use any of supported operators: running'
      )
    })

    describe('when operator if "running"', () => {
      it('runs "then" actions if the condition is true', async () => {
        psList.mockResolvedValue([
          {name: 'otherApp.exe'},
          {name: 'app.exe'},
          {name: 'otherApp2.exe'},
        ])
        actions = {
          if: {running: 'app.exe'},
          then: {key: 'space'},
        }

        await run(actions)

        expect(psList).toHaveBeenCalledTimes(1)
        expect(robot.keyTap).toHaveBeenCalledTimes(1)
        expect(robot.keyTap).toHaveBeenCalledWith('space')
      })

      it('runs "else" actions if the condition is false', async () => {
        psList.mockResolvedValue([{name: 'otherApp.exe'}, {name: 'otherApp2.exe'}])
        actions = {
          if: {running: 'app.exe'},
          then: {key: 'space'},
          else: {key: 'esc'},
        }

        await run(actions)

        expect(psList).toHaveBeenCalledTimes(1)
        expect(robot.keyTap).toHaveBeenCalledTimes(1)
        expect(robot.keyTap).toHaveBeenCalledWith('esc')
      })

      it('does not run anything if the condition is false and no "else" statement', async () => {
        psList.mockResolvedValue([{name: 'otherApp.exe'}, {name: 'otherApp2.exe'}])
        actions = {
          if: {running: 'app.exe'},
          then: {key: 'space'},
        }

        await run(actions)

        expect(psList).toHaveBeenCalledTimes(1)
        expect(robot.keyTap).not.toHaveBeenCalled()
        expect(execFileSync).not.toHaveBeenCalled()
      })
    })
  })

  describe('when "mouse" action', () => {
    it('does nothing if "robotjs" is not installed', async () => {
      jest.resetModules()
      jest.mock('robotjs', () => {
        throw new Error('mock error')
      })

      const run2 = require('../../lib/run')
      actions = {
        mouse: [{moveSmooth: [33, 44]}, {click: 'right'}, {move: [111, 222]}],
      }
      await run2(actions)

      expect(robot.mouseClick).not.toHaveBeenCalled()
      expect(robot.moveMouse).not.toHaveBeenCalled()
      expect(robot.moveMouseSmooth).not.toHaveBeenCalled()
    })

    it('rejects if mouse action is not supported', async () => {
      actions = {
        mouse: {unsupported: true},
      }
      await expect(run(actions)).rejects.toThrow(
        '"mouse" must contain any of supported actions: click, delay, move, moveSmooth'
      )
    })

    it('emulates mouse click if action is "click"', async () => {
      actions = {
        mouse: {click: 'left'},
      }
      await run(actions)

      expect(robot.mouseClick).toHaveBeenCalledTimes(1)
      expect(robot.mouseClick).toHaveBeenCalledWith('left')
    })

    it('sets mouse delay if action is "delay"', async () => {
      actions = {
        mouse: {delay: 30},
      }
      await run(actions)

      expect(robot.setMouseDelay).toHaveBeenCalledTimes(1)
      expect(robot.setMouseDelay).toHaveBeenCalledWith(30)
    })

    it('moves mouse if action is "move"', async () => {
      actions = {
        mouse: {move: [11, 22]},
      }
      await run(actions)

      expect(robot.moveMouse).toHaveBeenCalledTimes(1)
      expect(robot.moveMouse).toHaveBeenCalledWith(11, 22)
    })

    it('moves mouse smoothly if action is "moveSmooth"', async () => {
      actions = {
        mouse: {moveSmooth: [11, 22]},
      }
      await run(actions)

      expect(robot.moveMouseSmooth).toHaveBeenCalledTimes(1)
      expect(robot.moveMouseSmooth).toHaveBeenCalledWith(11, 22)
    })

    it('is able to run multiple actions', async () => {
      actions = {
        mouse: [{moveSmooth: [33, 44]}, {click: 'right'}, {move: [111, 222]}],
      }
      await run(actions)

      expect(robot.mouseClick).toHaveBeenCalledTimes(1)
      expect(robot.mouseClick).toHaveBeenCalledWith('right')
      expect(robot.moveMouse).toHaveBeenCalledTimes(1)
      expect(robot.moveMouse).toHaveBeenCalledWith(111, 222)
      expect(robot.moveMouseSmooth).toHaveBeenCalledTimes(1)
      expect(robot.moveMouseSmooth).toHaveBeenCalledWith(33, 44)
    })
  })

  describe('when multiple actions', () => {
    it('executes all actions', async () => {
      actions = [{exec: ['app']}, {key: 'space'}]
      await run(actions)

      expect(robot.keyTap).toHaveBeenCalledTimes(1)
      expect(robot.keyTap).toHaveBeenCalledWith('space')
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', [])
    })
  })

  describe('when multiple actions are mixed into one', () => {
    it('runs only first one alphabetically', async () => {
      actions = {
        exec: ['app', 'arg1'],
        key: 'space',
      }
      await run(actions)

      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', ['arg1'])
      expect(robot.keyTap).not.toHaveBeenCalled()
    })
  })
})
