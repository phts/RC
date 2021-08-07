# arduino-pc-remote-control: firmware

Includes two modifications:

- [PC-only]
- [PC + Akai GX-F37 cassette deck]

## Requirements

- [Arduino Uno]
- [IRremote Arduino library]
- [SimpleTimer library]

## Development

In order to properly compile libraries in sketch files set _Sketchbook location_ (_File > Preferences_) to "firmware" folder path.
You can keep _IRremote_ and _SimpleTimer_ libraries in this folder or in global Arduino's folder.

[pc-only]: ./pc-only
[pc + akai gx-f37 cassette deck]: ./pc-and-akai
[arduino uno]: httphttps://store.arduino.cc/arduino-uno-rev3
[irremote arduino library]: http://z3t0.github.io/Arduino-IRremote/
[simpletimer library]: https://github.com/kiryanenko/SimpleTimer
