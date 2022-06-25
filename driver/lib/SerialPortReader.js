'use strict'

const {SerialPort} = require('serialport')
const {ReadlineParser} = require('@serialport/parser-readline')
const {SERIAL_BAUD_RATE} = require('./constants')
const debug = require('./debug')

class SerialPortReader {
  constructor(port) {
    this.serialPort = new SerialPort({path: port, baudRate: SERIAL_BAUD_RATE})
    this.stream = this.serialPort.pipe(new ReadlineParser({delimiter: '\r\n'}))
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
