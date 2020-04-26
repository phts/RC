# arduino-pc-remote-control: firmware

## Requirements

- [IRremote Arduino Library](http://z3t0.github.io/Arduino-IRremote/)

## [PC-only](./pc-only/pc-only.ino)

<image width=500 src="./doc/pc-only-circuit.png">

<image width=500 src="./doc/pc-only-proto.jpg">

Inspired by *[How to Set Up an IR Remote and Receiver on an Arduino](http://www.circuitbasics.com/arduino-ir-remote-receiver-tutorial/)*.

## [PC + Akai GX-F37 cassette deck](./pc-and-akai/pc-and-akai.ino)

<image width=500 src="./doc/pc-and-akai-circuit.jpg">

<image width=500 src="./doc/pc-and-akai-proto.jpg">

- "CD power" button to switch control between PC and Akai
- Supports receiving signals via serial port from driver to light LEDs (red, yellow, green, blue)
- When Akai control is active then all LEDs are turned on and PC does not receive any signals

### LEDs

In order to light LEDs on the device, driver should send back an integer via serial port to Arduino. 1<sup>st</sup> bit of this number corresponds to red, 2<sup>nd</sup> &mdash; yellow, 3<sup>rd</sup> &mdash; green, 4<sup>th</sup> &mdash; blue. 5<sup>th</sup> bit is always `1`.

For example, send `0b10011` (=19) to light red and yellow LEDs simultaneously.

## Development

In order to properly compile libraries in sketch files set _Sketchbook location_ (_File > Preferences_) to "firmware" folder path.
