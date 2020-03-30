import * as SerialPort from 'serialport'

export default class SerialPortReader {
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
