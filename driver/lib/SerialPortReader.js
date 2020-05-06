'use strict'

const SerialPort = require('serialport')
const {SERIAL_BAUD_RATE} = require('./constants')

class SerialPortReader {
  constructor(port) {
    this.serialPort = new SerialPort(port, {baudRate: SERIAL_BAUD_RATE})
    this.stream = this.serialPort.pipe(new SerialPort.parsers.Readline())
  }

  start(handler) {
    this.stream.on('readable', () => {
      const data = this.stream.read().trim()
      handler(data, (value) => this.serialPort.write(Buffer.from([value])))
    })
  }
}

module.exports = SerialPortReader
