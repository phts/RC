# PHTS RC-02

<image width=500 src="../img/RC-02-real.jpg">

<details>
<summary>More photos...</summary>

<image width=500 src="../img/RC-02-circuit.jpg">

<image width=500 src="../img/RC-02-proto.jpg">

</details>

## Schematic diagram and PCB

Hosted on: [OSHWLab/phts/arduino-pc-remote-control].

## Features

- Compatible with remote control [Akai RC-21] interface
- "CD power" button to switch control between PC and Akai
- Supports receiving signals via serial port from driver to light LEDs (red, yellow, green, blue, white)
- When Akai control is active then big white LED is turned on and PC does not receive any signals

## Parts

- VS1838B
- [MCY 74066] &times; 2
- Resistor 220 Ω &times; 6
- LED &times; 6

## LEDs

In order to light LEDs on the device, driver should send back an integer via serial port to Arduino. 1<sup>st</sup> bit of this number corresponds to red, 2<sup>nd</sup> &mdash; yellow, 3<sup>rd</sup> &mdash; green, 4<sup>th</sup> &mdash; blue, 5<sup>th</sup> &mdash; white. 6<sup>th</sup> bit is always `1`.

For example, send `0b100011` (=35) to light red and yellow LEDs simultaneously.

## Ping

This modification determines if PC is disconnected. Firmware is sending "PING" string to PC via serial port every 3 minutes. Driver responds with "PONG" string. If PC is disconnected then all LEDs are turn off.

## Dependencies

- [IRremote] v2.5.0
- [SimpleTimer]

[OSHWLab/phts/arduino-pc-remote-control]: https://oshwlab.com/phts/arduino-pc-remote-control
[mcy 74066]: https://www.datasheetarchive.com/pdf/download.php?id=10e21403acd8e45d1c1a31d420988ef8e63843&type=M
[akai rc-21]: https://www.hifiengine.com/manual_library/akai/rc-21.shtml
[IRremote]: https://github.com/Arduino-IRremote/Arduino-IRremote
[SimpleTimer]: https://github.com/kiryanenko/SimpleTimer
