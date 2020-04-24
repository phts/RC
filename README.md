# arduino-pc-remote-control

This application is created specially for remote control RAS13.
However theoretically it supports any other remote controls because all buttons and mappings
are configurable.

## [Firmware](./firmware)

Arduino firmware which receives signals from an IR receiver, converts them into human-readable
strings and writes them to serial port.

Two versions available:

- PC-only control
- PC and Akai GX-F37 cassette deck control

## [Driver](./driver)

This is a Node.js application which reads serial port and performs actions associated with the
particular button on a remote control.

---

[![Akai GX-F37 stereo cassette deck](./doc/akai-gx-f37.jpg)](https://www.hifiengine.com/manual_library/akai/gx-f37.shtml)

[![Yamaha A-S501 and remote control RAS13](https://europe.yamaha.com/en/files/C16F0F418BB745F49102B5E9C3843ACC_12073_3463x1436_cce09bb4e60b3b00fb7eb63eda5c26f2.jpg)](https://europe.yamaha.com/en/products/audio_visual/hifi_components/a-s501/index.html)
