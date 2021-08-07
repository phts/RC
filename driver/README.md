# Driver

This is Node.js application which reads data from serial port sent by [arduino]
and performs actions mapped for the particular button on a remote control.

## Install

To support keyboard and mouse actions by [robotjs]
you have to install build tools first. However it is not required for the whole
application &mdash; if you don't use keyboard/mouse actions then this step is not needed as well.

- Windows

  - [windows-build-tools].
    Run in PowerShell or CMD.exe:

    ```bash
    $ npm install --global --production windows-build-tools
    ```

- Mac

  - Xcode Command Line Tools

- Linux

  - Python (v2.7 recommended, v3.x.x is not supported)
  - make
  - A C/C++ compiler like GCC
  - libxtst-dev and libpng++-dev

    ```bash
    $ sudo apt-get install libxtst-dev libpng++-dev
    ```

Then install local dependencies:

```bash
$ npm i
```

## Usage

- Run in normal mode:

  ```bash
  $ npm start
  ```

- Run in debug mode:

  ```bash
  $ npm run start:debug
  ```

## Configuration

Key mapping configuration is contained in [`settings.json`]. For example:

```json
{
  "serialPort": "COM# or /dev/tty-xxx",
  "debounceDelay": 150,
  "noDebounce": ["volume_up", "volume_down"],
  "mappings": {
    "play": {
      "if": {"running": "mpc-hc.exe"},
      "then": {"key": "space"},
      "else": {"exec": ["c:\\Program Files (x86)\\foobar2000\\foobar2000.exe", "/play"]}
    },
    "rew": {
      "if": {"running": "mpc-hc.exe"},
      "then": {"key": ["shift", "left"]}
    },
    "ff": {
      "if": {"running": "mpc-hc.exe"},
      "then": {"key": ["shift", "right"]}
    }
  }
}
```

### Serial port

Required. To be able to connect to your Arduino.

### Debounce

While pressing a button on the remote control IR it sends a lot of repeating signals.
Each of those signals are treated as separate button presses by the driver.
In this case a single action would be run multiple times on a single actual button press.

To avoid such behavior there is `debounceDelay` value. By default &mdash; 150 (ms).
This ensures to run your action only once on one button press.

However this behavior is not acceptable in all cases. For example for volume control it
is useful opposite behavior to have possibility to change volume while button is pressed.
This is controlled by `noDebounce` value.

### Mappings

Each mapping is a key-value value where the key is [a button on the remote control]
and the value is an action or a list of actions.

#### Supported actions

- Condition `if`

  Operators:

  - `running` &mdash; check if running application (using [ps-list])

    ```json
    {
      "if": {"running": "mpc-hc.exe"},
      "then": ["list of actions described below"],
      "else": ["list of actions described below"]
    }
    ```

  - `state` &mdash; check current state controlled by action `state` (see below)

    ```json
    {
      "if": {"state": "turned off"},
      "then": ["list of actions described below"],
      "else": ["list of actions described below"]
    }
    ```

- Emulate key press. Key codes could be retrieved from [robotjs syntax] or [robotjs.cc file]

  ```json
  {"key": "space"}
  ```

- Run application

  ```json
  {"exec": ["c:\\Program Files (x86)\\foobar2000\\foobar2000.exe", "/play"]}
  ```

- Control mouse

  ```json
  {"mouse": ["set of mouse actions described below"]}
  ```

  - `click`

    ```json
    {"click": "left | right | middle"}
    ```

  - `delay`

    ```json
    {"delay": 30}
    ```

  - `doubleClick`

    ```json
    {"delay": "left | right | middle"}
    ```

  - `move`

    ```json
    {"move": [1750, 100]}
    ```

  - `moveSmooth`

    ```json
    {"moveSmooth": [1750, 100]}
    ```

  - `moveRelative`

    ```json
    {"moveRelative": [100, 200]}
    ```

  - `moveRelativeSmooth`

    ```json
    {"moveRelativeSmooth": [100, 200]}
    ```

  - `scroll`

    ```json
    {"scroll": 42}
    ```

- Switch state

  ```json
  {"state": ["music", "video", "browser", "etc"]}
  ```

  Every time when this action is executed a global state will be updated with the next value listed in the array.

  This state can be retrieved by `if` to do different things depending on the current value.

- Switch on/off LEDs on the device

  ```json
  {"led": "red"},           // as string - "red" | "yellow"  | "green" | "blue"
  {"led": ["red", "blue"]}, // as array
  {"led": []},              // empty array - to switch off all LEDs
  ```

[arduino]: ../firmware
[robotjs]: https://www.npmjs.com/package/robotjs
[windows-build-tools]: https://www.npmjs.com/package/windows-build-tools
[`settings.json`]: ./settings.json.example
[ps-list]: https://www.npmjs.com/package/ps-list
[robotjs syntax]: http://robotjs.io/docs/syntax#keys
[a button on the remote control]: ../firmware/libraries/yamaha-ras13/yamaha-ras13.h
[robotjs.cc file]: https://github.com/octalmage/robotjs/blob/v0.6.0/src/robotjs.cc#L289
