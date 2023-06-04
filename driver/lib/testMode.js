'use strict'

const {SerialPort} = require('serialport')
const {SERIAL_BAUD_RATE} = require('./constants')
const led = require('./handlers/led')

function sleep(msec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, msec)
  })
}

async function testMode(settings) {
  console.info('Initializing...')
  const serialPort = new SerialPort({path: settings.serialPort, baudRate: SERIAL_BAUD_RATE})

  const writeToSerial = (value) => {
    serialPort.write(Buffer.from([value]))
  }

  await sleep(2000)
  for (const color of ['red', 'yellow', 'green', 'blue', 'white', 'akai']) {
    console.info(color)
    led({led: color}, writeToSerial)
    await sleep(500)
  }
  led({led: []}, writeToSerial)
}

module.exports = testMode
