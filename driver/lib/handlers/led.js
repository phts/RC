'use strict'

const LED_OVERHEAD = 0b10000
const LED_RED = 0b0001
const LED_YELLOW = 0b0010
const LED_GREEN = 0b0100
const LED_BLUE = 0b1000

const COLOR_TO_LED = {
  red: LED_RED,
  yellow: LED_YELLOW,
  green: LED_GREEN,
  blue: LED_BLUE,
}

function covertColorsToLeds(colors) {
  return colors
    .map((c) => {
      const led = COLOR_TO_LED[c]
      if (!led) {
        throw new Error(
          `LED value "${c}" is unsupported. Supported values are: ${Object.keys(COLOR_TO_LED).join(
            ', '
          )}.`
        )
      }
      return led
    })
    .reduce((leds, led) => leds | led, 0)
}

module.exports = async function led(action, writeToSerial) {
  const {led} = action
  if (!led) {
    return false
  }

  let colors = led
  if (typeof led === 'string') {
    colors = [led]
  }

  if (!Array.isArray(colors)) {
    throw new Error('"led" must be a string or an array')
  }

  const leds = covertColorsToLeds(colors)
  writeToSerial(leds + LED_OVERHEAD)

  return true
}
