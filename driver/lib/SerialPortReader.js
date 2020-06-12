'use strict'

const SerialPort = require('serialport')
const {SERIAL_BAUD_RATE} = require('./constants')
const debug = require('./debug')

class SerialPortReader {
  constructor(port) {
    this.serialPort = new SerialPort(port, {baudRate: SERIAL_BAUD_RATE})
    this.stream = this.serialPort.pipe(new SerialPort.parsers.Readline())
  }

  start(handler) {
    this.stream.on('readable', () => {
      const data = this.stream.read().trim()
      handler(data, (value) => {
        value = typeof value === 'string' ? value : Buffer.from([value])
        debug.output(value)
        this.serialPort.write(value)
      })
    })
  }
}

module.exports = SerialPortReader
