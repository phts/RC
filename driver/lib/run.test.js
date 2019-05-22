'use strict'

const ks = require('node-key-sender')
const psList = require('ps-list')
const {execFileSync} = require('child_process')

const run = require('./run')

jest.mock('node-key-sender', () => ({
  sendKey: jest.fn(),
}))
jest.mock('ps-list', () => jest.fn(async () => {}))
jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}))

describe('run', () => {
  let actions

  beforeEach(() => {
    psList.mockReset()
    execFileSync.mockClear()
    ks.sendKey.mockClear()
  })

  describe('when single exec action', () => {
    it('executes the specified file without args', async () => {
      actions = {
        exec: ['app'],
      }
      await run(actions)

      expect(ks.sendKey).not.toHaveBeenCalled()
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', [])
    })

    it('executes the specified file with args', async () => {
      actions = {
        exec: ['app', 'arg1', 'arg2'],
      }
      await run(actions)

      expect(ks.sendKey).not.toHaveBeenCalled()
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', ['arg1', 'arg2'])
    })
  })

  describe('when single key action', () => {
    it('sends the specified key press', async () => {
      actions = {
        key: 'space',
      }
      await run(actions)

      expect(execFileSync).not.toHaveBeenCalled()
      expect(ks.sendKey).toHaveBeenCalledTimes(1)
      expect(ks.sendKey).toHaveBeenCalledWith('space')
    })

    it('rejects if key not a string', async () => {
      actions = {
        key: ['not string'],
      }

      await expect(run(actions)).rejects.toThrow('"key" must be a string')
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
        '"if" must use any of supported operators: running',
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
        expect(ks.sendKey).toHaveBeenCalledTimes(1)
        expect(ks.sendKey).toHaveBeenCalledWith('space')
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
        expect(ks.sendKey).toHaveBeenCalledTimes(1)
        expect(ks.sendKey).toHaveBeenCalledWith('esc')
      })

      it('does not run enaything if the condition is false and no "else" statement', async () => {
        psList.mockResolvedValue([{name: 'otherApp.exe'}, {name: 'otherApp2.exe'}])
        actions = {
          if: {running: 'app.exe'},
          then: {key: 'space'},
        }

        await run(actions)

        expect(psList).toHaveBeenCalledTimes(1)
        expect(ks.sendKey).not.toHaveBeenCalled()
        expect(execFileSync).not.toHaveBeenCalled()
      })
    })
  })

  describe('when multiple actions', () => {
    it('executes all actions', async () => {
      actions = [{exec: ['app']}, {key: 'space'}]
      await run(actions)

      expect(ks.sendKey).toHaveBeenCalledTimes(1)
      expect(ks.sendKey).toHaveBeenCalledWith('space')
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', [])
    })
  })
})
