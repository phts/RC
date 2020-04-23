# arduino-pc-remote-control: driver

This is Node.js application which reads data from serial port written by [arduino](https://github.com/phts/remote-control/tree/master/firmware)
and performs actions mapped for the particular button on a remote control.

## Install

To support keyboard and mouse actions by [robotjs](https://www.npmjs.com/package/robotjs)
you have to install build tools first. However it is not required for the whole
application &mdash; if you don't use keyboard/mouse actions then this step is not needed as well.

- Windows

  - [windows-build-tools](https://www.npmjs.com/package/windows-build-tools).
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

```bash
$ npm start
```

## Configuration

Key mapping configuration is contained in `settings.json`. For example:

```json
{
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

### Supported actions

- Condition `if`

  Operators:

  - `running` &mdash; check if running application (using [ps-list](https://www.npmjs.com/package/ps-list))

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

- Emulate key press. Key codes could be retrieved from
  [robotjs](http://robotjs.io/docs/syntax#keys)

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

  - `move`

    ```json
    {"move": [1750, 100]}
    ```

  - `moveSmooth`

    ```json
    {"moveSmooth": [1750, 100]}
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
