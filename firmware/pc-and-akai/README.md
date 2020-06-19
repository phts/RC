# [PC + Akai GX-F37 cassette deck](./pc-and-akai.ino)

Project on EasyEDA: https://easyeda.com/phts/arduino-pc-remote-control

<image width=500 src="../doc/pc-and-akai-circuit.jpg">

<image width=500 src="../doc/pc-and-akai-proto.jpg">

<image width=500 src="../doc/pc-and-akai-real.jpg">

## Features

- "CD power" button to switch control between PC and Akai
- Supports receiving signals via serial port from driver to light LEDs (red, yellow, green, blue, white)
- When Akai control is active then big white LED is turned on and PC does not receive any signals

## Parts

* VS1838B
* [MCY 74066] &times; 2
* Resistor 220 Ω &times; 6
* LED &times; 6

## LEDs

In order to light LEDs on the device, driver should send back an integer via serial port to Arduino. 1<sup>st</sup> bit of this number corresponds to red, 2<sup>nd</sup> &mdash; yellow, 3<sup>rd</sup> &mdash; green, 4<sup>th</sup> &mdash; blue, 5<sup>th</sup> &mdash; white. 6<sup>th</sup> bit is always `1`.

For example, send `0b100011` (=35) to light red and yellow LEDs simultaneously.

## Ping

This modification determines if PC is disconnected. Firmware is sending "PING" string to PC via serial port every 3 minutes. Driver responds with "PONG" string. If PC is disconnected then all LEDs are turn off.

[mcy 74066]: https://www.datasheetarchive.com/pdf/download.php?id=10e21403acd8e45d1c1a31d420988ef8e63843&type=M
