'use strict'

const SerialPort = require('serialport')
const {SERIAL_BAUD_RATE} = require('./constants')
const debug = require('./debug')

class SerialPortReader {
  constructor(port) {
    this.serialPort = new SerialPort(port, {baudRate: SERIAL_BAUD_RATE})
    this.stream = this.serialPort.pipe(new SerialPort.parsers.Readline({delimiter: '\r\n'}))
  }

  start(handler) {
    this.stream.on('data', (data) => {
      handler(data, (value) => {
        value = typeof value === 'string' ? value : Buffer.from([value])
        debug.output(value)
        this.serialPort.write(value)
      })
    })
  }
}

module.exports = SerialPortReader
