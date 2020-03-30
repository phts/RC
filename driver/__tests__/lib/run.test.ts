import {execFileSync} from 'child_process'
import psList from 'ps-list'
import {keyTap, mouseClick, moveMouse, moveMouseSmooth, setMouseDelay} from 'robotjs'

import run from '../../lib/run'

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

const psListMock = psList as jest.MockedFunction<typeof psList>
const execFileSyncMock = execFileSync as jest.MockedFunction<typeof execFileSync>
const keyTapMock = keyTap as jest.MockedFunction<typeof keyTap>
const mouseClickMock = mouseClick as jest.MockedFunction<typeof mouseClick>
const moveMouseMock = moveMouse as jest.MockedFunction<typeof moveMouse>
const moveMouseSmoothMock = moveMouseSmooth as jest.MockedFunction<typeof moveMouseSmooth>
const setMouseDelayMock = setMouseDelay as jest.MockedFunction<typeof setMouseDelay>

describe('run', () => {
  let actions

  beforeEach(() => {
    execFileSyncMock.mockClear()
    psListMock.mockReset()
    keyTapMock.mockClear()
    mouseClickMock.mockClear()
    moveMouseMock.mockClear()
    moveMouseSmoothMock.mockClear()
    setMouseDelayMock.mockClear()
  })

  describe('when "exec" action', () => {
    it('executes the specified file without args (as array)', async () => {
      actions = {
        exec: ['app'],
      }
      await run(actions)

      expect(keyTapMock).not.toHaveBeenCalled()
      expect(execFileSyncMock).toHaveBeenCalledTimes(1)
      expect(execFileSyncMock).toHaveBeenCalledWith('app', [])
    })

    it('executes the specified file without args (as string)', async () => {
      actions = {
        exec: 'app',
      }
      await run(actions)

      expect(keyTapMock).not.toHaveBeenCalled()
      expect(execFileSyncMock).toHaveBeenCalledTimes(1)
      expect(execFileSyncMock).toHaveBeenCalledWith('app')
    })

    it('executes the specified file with args', async () => {
      actions = {
        exec: ['app', 'arg1', 'arg2'],
      }
      await run(actions)

      expect(keyTapMock).not.toHaveBeenCalled()
      expect(execFileSyncMock).toHaveBeenCalledTimes(1)
      expect(execFileSyncMock).toHaveBeenCalledWith('app', ['arg1', 'arg2'])
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

      expect(execFileSyncMock).not.toHaveBeenCalled()
      expect(keyTapMock).toHaveBeenCalledTimes(1)
      expect(keyTapMock).toHaveBeenCalledWith('space')
    })

    it('sends the specified key combination if passed array', async () => {
      actions = {
        key: ['shift', 'space'],
      }
      await run(actions)

      expect(execFileSyncMock).not.toHaveBeenCalled()
      expect(keyTapMock).toHaveBeenCalledTimes(1)
      expect(keyTapMock).toHaveBeenCalledWith('space', ['shift'])
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
        psListMock.mockResolvedValue([
          {pid: 1, ppid: 2, name: 'otherApp.exe'},
          {pid: 1, ppid: 2, name: 'app.exe'},
          {pid: 1, ppid: 2, name: 'otherApp2.exe'},
        ])
        actions = {
          if: {running: 'app.exe'},
          then: {key: 'space'},
        }

        await run(actions)

        expect(psListMock).toHaveBeenCalledTimes(1)
        expect(keyTapMock).toHaveBeenCalledTimes(1)
        expect(keyTapMock).toHaveBeenCalledWith('space')
      })

      it('runs "else" actions if the condition is false', async () => {
        psListMock.mockResolvedValue([
          {pid: 1, ppid: 2, name: 'otherApp.exe'},
          {pid: 1, ppid: 2, name: 'otherApp2.exe'},
        ])
        actions = {
          if: {running: 'app.exe'},
          then: {key: 'space'},
          else: {key: 'esc'},
        }

        await run(actions)

        expect(psListMock).toHaveBeenCalledTimes(1)
        expect(keyTapMock).toHaveBeenCalledTimes(1)
        expect(keyTapMock).toHaveBeenCalledWith('esc')
      })

      it('does not run anything if the condition is false and no "else" statement', async () => {
        psListMock.mockResolvedValue([
          {pid: 1, ppid: 2, name: 'otherApp.exe'},
          {pid: 1, ppid: 2, name: 'otherApp2.exe'},
        ])
        actions = {
          if: {running: 'app.exe'},
          then: {key: 'space'},
        }

        await run(actions)

        expect(psListMock).toHaveBeenCalledTimes(1)
        expect(keyTapMock).not.toHaveBeenCalled()
        expect(execFileSyncMock).not.toHaveBeenCalled()
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

      expect(mouseClickMock).not.toHaveBeenCalled()
      expect(moveMouseMock).not.toHaveBeenCalled()
      expect(moveMouseSmoothMock).not.toHaveBeenCalled()
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

      expect(mouseClickMock).toHaveBeenCalledTimes(1)
      expect(mouseClickMock).toHaveBeenCalledWith('left')
    })

    it('sets mouse delay if action is "delay"', async () => {
      actions = {
        mouse: {delay: 30},
      }
      await run(actions)

      expect(setMouseDelayMock).toHaveBeenCalledTimes(1)
      expect(setMouseDelayMock).toHaveBeenCalledWith(30)
    })

    it('moves mouse if action is "move"', async () => {
      actions = {
        mouse: {move: [11, 22]},
      }
      await run(actions)

      expect(moveMouseMock).toHaveBeenCalledTimes(1)
      expect(moveMouseMock).toHaveBeenCalledWith(11, 22)
    })

    it('moves mouse smoothly if action is "moveSmooth"', async () => {
      actions = {
        mouse: {moveSmooth: [11, 22]},
      }
      await run(actions)

      expect(moveMouseSmoothMock).toHaveBeenCalledTimes(1)
      expect(moveMouseSmoothMock).toHaveBeenCalledWith(11, 22)
    })

    it('is able to run multiple actions', async () => {
      actions = {
        mouse: [{moveSmooth: [33, 44]}, {click: 'right'}, {move: [111, 222]}],
      }
      await run(actions)

      expect(mouseClickMock).toHaveBeenCalledTimes(1)
      expect(mouseClickMock).toHaveBeenCalledWith('right')
      expect(moveMouseMock).toHaveBeenCalledTimes(1)
      expect(moveMouseMock).toHaveBeenCalledWith(111, 222)
      expect(moveMouseSmoothMock).toHaveBeenCalledTimes(1)
      expect(moveMouseSmoothMock).toHaveBeenCalledWith(33, 44)
    })
  })

  describe('when multiple actions', () => {
    it('executes all actions', async () => {
      actions = [{exec: ['app']}, {key: 'space'}]
      await run(actions)

      expect(keyTapMock).toHaveBeenCalledTimes(1)
      expect(keyTapMock).toHaveBeenCalledWith('space')
      expect(execFileSyncMock).toHaveBeenCalledTimes(1)
      expect(execFileSyncMock).toHaveBeenCalledWith('app', [])
    })
  })

  describe('when multiple actions are mixed into one', () => {
    it('runs only first one alphabetically', async () => {
      actions = {
        exec: ['app', 'arg1'],
        key: 'space',
      }
      await run(actions)

      expect(execFileSyncMock).toHaveBeenCalledTimes(1)
      expect(execFileSyncMock).toHaveBeenCalledWith('app', ['arg1'])
      expect(keyTapMock).not.toHaveBeenCalled()
    })
  })
})
