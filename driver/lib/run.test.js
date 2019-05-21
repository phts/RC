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
    execFileSync.mockClear()
    ks.sendKey.mockClear()
  })

  describe('when single exec action', () => {
    it('executes the specified file without args', async () => {
      actions = [
        {
          exec: ['app'],
        },
      ]
      await run(actions)

      expect(ks.sendKey).not.toHaveBeenCalled()
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', [])
    })

    it('executes the specified file with args', async () => {
      actions = [
        {
          exec: ['app', 'arg1', 'arg2'],
        },
      ]
      await run(actions)

      expect(ks.sendKey).not.toHaveBeenCalled()
      expect(execFileSync).toHaveBeenCalledTimes(1)
      expect(execFileSync).toHaveBeenCalledWith('app', ['arg1', 'arg2'])
    })
  })

  describe('when single key action', () => {
    it('sends the specified key press', async () => {
      actions = [
        {
          key: 'space',
        },
      ]
      await run(actions)

      expect(execFileSync).not.toHaveBeenCalled()
      expect(ks.sendKey).toHaveBeenCalledTimes(1)
      expect(ks.sendKey).toHaveBeenCalledWith('space')
    })

    it('rejects if key not a string', () => {
      actions = [
        {
          key: ['not string'],
        },
      ]

      expect(run(actions)).rejects.toThrow()
    })
  })
})
