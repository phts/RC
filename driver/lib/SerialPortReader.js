'use strict'

const SerialPort = require('serialport')

module.exports = class SerialPortReader {
  constructor(port) {
    const serialPort = new SerialPort(port)
    this.lineStream = serialPort.pipe(new SerialPort.parsers.Readline())
  }

  start(handler) {
    this.lineStream.on('readable', () => {
      const data = this.lineStream.read().trim()
      handler(data)
    })
  }
}
