# PHTS RC-\*\*

This device is created specially for remote control _Yamaha RAS13_.
However theoretically it supports any other remote controls because all buttons and mappings
are configurable.

## [Firmware](./firmware)

Arduino firmware which receives signals from an IR receiver, converts them into human-readable
strings and sends them to serial port.

## [Driver](./driver)

This is a Node.js application which reads serial port and performs actions associated with the
particular button on a remote control.

---

<p align="center">
<a href="https://europe.yamaha.com/en/products/audio_visual/hifi_components/a-s501/index.html">
<img
  src="https://europe.yamaha.com/en/files/C16F0F418BB745F49102B5E9C3843ACC_12073_cce09bb4e60b3b00fb7eb63eda5c26f2.jpg"
  alt="Yamaha A-S501 and remote control RAS13">
</a>
</p>

<p align="center">&#10084;</p>

<p align="center">
<a href="https://www.hifiengine.com/manual_library/akai/gx-f37.shtml">
<img
  src="https://www.hifiengine.com/images/model/akai_gx-f37_stereo_cassette_deck.jpg"
  alt="Akai GX-F37 stereo cassette deck">
</a>
</p>
