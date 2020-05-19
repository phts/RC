'use strict'

const {execFileSync} = require('child_process')
const psList = require('ps-list')
const robot = require('robotjs')

const storage = require('../../lib/storage')
const run = require('../../lib/run')

jest.mock('ps-list', () => jest.fn(async () => {}))
jest.mock('robotjs', () => ({
  getMousePos: jest.fn(),
  keyTap: jest.fn(),
  mouseClick: jest.fn(),
  moveMouse: jest.fn(),
  moveMouseSmooth: jest.fn(),
  scrollMouse: jest.fn(),
  setMouseDelay: jest.fn(),
}))
jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}))

function toBinaryStr(number) {
  return `0b${number.toString(2).padStart(4, '0')}`
}

describe('run', () => {
  let actions
  let writeToSerial

  beforeEach(() => {
    execFileSync.mockClear()
    psList.mockReset()
    robot.getMousePos.mockClear()
    robot.keyTap.mockClear()
    robot.mouseClick.mockClear()
    robot.moveMouse.mockClear()
    robot.moveMouseSmooth.mockClear()
    robot.scrollMouse.mockClear()
    robot.setMouseDelay.mockClear()
    writeToSerial = jest.fn()
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

    describe('when operator "running"', () => {
      it('runs "then" actions if the specified application is running', async () => {
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

      it('runs "else" actions if specified application is not running', async () => {
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

    describe('when operator "state"', () => {
      const currentState = 'state42'
      let getCurrentValueMock

      beforeAll(() => {
        getCurrentValueMock = jest.spyOn(storage, 'getCurrentValue').mockReturnValue(currentState)
      })

      afterAll(() => {
        getCurrentValueMock.mockRestore()
      })

      it('runs "then" actions if the specified state is current', async () => {
        actions = {
          if: {state: currentState},
          then: {key: 'space'},
          else: {key: 'esc'},
        }

        await run(actions)

        expect(robot.keyTap).toHaveBeenCalledTimes(1)
        expect(robot.keyTap).toHaveBeenCalledWith('space')
      })

      it('runs "else" actions if the specified state is not current', async () => {
        actions = {
          if: {state: 'notCurrent'},
          then: {key: 'space'},
          else: {key: 'esc'},
        }

        await run(actions)

        expect(robot.keyTap).toHaveBeenCalledTimes(1)
        expect(robot.keyTap).toHaveBeenCalledWith('esc')
      })

      it('does not run anything if the condition is false and no "else" statement', async () => {
        actions = {
          if: {state: 'notCurrent'},
          then: {key: 'space'},
        }

        await run(actions)

        expect(robot.keyTap).not.toHaveBeenCalled()
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
        '"mouse" must contain any of supported actions: click, delay, doubleClick, move, moveSmooth, moveRelative, moveRelativeSmooth, scroll'
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

    it('emulates mouse double click if action is "doubleClick"', async () => {
      actions = {
        mouse: {doubleClick: 'right'},
      }
      await run(actions)

      expect(robot.mouseClick).toHaveBeenCalledTimes(1)
      expect(robot.mouseClick).toHaveBeenCalledWith('right', true)
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

    it('moves mouse relative to current position if action is "moveRelative"', async () => {
      jest.spyOn(robot, 'getMousePos').mockReturnValue({x: 100, y: 200})
      actions = {
        mouse: {moveRelative: [11, 22]},
      }
      await run(actions)

      expect(robot.moveMouse).toHaveBeenCalledTimes(1)
      expect(robot.moveMouse).toHaveBeenCalledWith(111, 222)
    })

    it('moves mouse smoothly relative to current position if action is "moveRelativeSmooth"', async () => {
      jest.spyOn(robot, 'getMousePos').mockReturnValue({x: 100, y: 200})
      actions = {
        mouse: {moveRelativeSmooth: [11, 22]},
      }
      await run(actions)

      expect(robot.moveMouseSmooth).toHaveBeenCalledTimes(1)
      expect(robot.moveMouseSmooth).toHaveBeenCalledWith(111, 222)
    })

    it('emulates mouse scroll if action is "scroll"', async () => {
      actions = {
        mouse: {scroll: 100},
      }
      await run(actions)

      expect(robot.scrollMouse).toHaveBeenCalledTimes(1)
      expect(robot.scrollMouse).toHaveBeenCalledWith(0, 100)
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

  describe('when "state" action', () => {
    it('sets next value in the storage on each execution', async () => {
      actions = {
        state: ['state1', 'state2', 'state3'],
      }

      await run(actions)
      expect(storage.getCurrentValue()).toEqual('state1')

      await run(actions)
      expect(storage.getCurrentValue()).toEqual('state2')

      await run(actions)
      expect(storage.getCurrentValue()).toEqual('state3')

      await run(actions)
      expect(storage.getCurrentValue()).toEqual('state1')
    })
  })

  describe('when "led" action', () => {
    const EXPECTED_OVERHEAD = 0b100000
    const EXPECTED = {
      red: EXPECTED_OVERHEAD ^ 0b00001,
      yellow: EXPECTED_OVERHEAD ^ 0b00010,
      green: EXPECTED_OVERHEAD ^ 0b00100,
      blue: EXPECTED_OVERHEAD ^ 0b01000,
      white: EXPECTED_OVERHEAD ^ 0b10000,
    }

    it('rejects if "led" has wrong type', async () => {
      actions = {
        led: {wrong: 'type'},
      }

      await expect(run(actions)).rejects.toThrow('"led" must be a string or an array')
    })

    it('rejects if "led" has wrong value', async () => {
      actions = {
        led: 'wrong',
      }

      await expect(run(actions)).rejects.toThrow(
        'LED value "wrong" is unsupported. Supported values are: red, yellow, green, blue, white.'
      )
    })

    describe('when value is a string', () => {
      Object.entries(EXPECTED).forEach(([color, expected]) => {
        it(`writes ${expected} (${toBinaryStr(
          expected
        )}) into serial port if led="${color}"`, async () => {
          actions = {
            led: color,
          }
          await run(actions, writeToSerial)

          expect(writeToSerial).toHaveBeenCalledTimes(1)
          expect(writeToSerial).toHaveBeenCalledWith(expected)
        })
      })
    })

    describe('when value is an empty array', () => {
      it(`writes ${EXPECTED_OVERHEAD} (${toBinaryStr(
        EXPECTED_OVERHEAD
      )}) into serial port to turn off all LEDs`, async () => {
        writeToSerial.mockClear()
        actions = {
          led: [],
        }
        await run(actions, writeToSerial)
        expect(writeToSerial).toHaveBeenCalledTimes(1)
        expect(writeToSerial).toHaveBeenCalledWith(EXPECTED_OVERHEAD)
      })
    })

    describe('when value is a non-empty array', () => {
      it('writes bitwise OR of all array items into serial port', async () => {
        for (const r of [[], ['red']]) {
          for (const y of [[], ['yellow']]) {
            for (const g of [[], ['green']]) {
              for (const b of [[], ['blue']]) {
                for (const w of [[], ['white']]) {
                  writeToSerial.mockClear()
                  const led = [...r, ...y, ...g, ...b, ...w]
                  if (led.length === 0) {
                    return
                  }
                  actions = {
                    led,
                  }
                  await run(actions, writeToSerial)
                  const expected = led.reduce((acc, l) => {
                    return acc | EXPECTED[l]
                  }, EXPECTED_OVERHEAD)

                  expect(writeToSerial).toHaveBeenCalledTimes(1)
                  expect(writeToSerial).toHaveBeenCalledWith(expected)
                }
              }
            }
          }
        }
      })

      it('rejects if array contains wrong values', async () => {
        actions = {
          led: ['red', 'wrong', 'yellow'],
        }
        await expect(run(actions)).rejects.toThrow(
          'LED value "wrong" is unsupported. Supported values are: red, yellow, green, blue, white.'
        )
      })
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
