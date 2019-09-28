# arduino-pc-remote-control: driver

This is Node.js application which reads data from serial port written by [arduino](https://github.com/phts/remote-control/tree/master/firmware)
and performs actions mapped for the particular button on a remote control.

## Install

To support mouse actions by [robotjs](https://www.npmjs.com/package/robotjs)
you have to install build tools. However this is not required for the whole application &mdash;
if mouse actions are not needed then this step is not needed as well.

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

- Condition

  - `running` - check if running application (using [ps-list](https://www.npmjs.com/package/ps-list))

    ```json
    {
      "if": {"running": "mpc-hc.exe"},
      "then": ["list of actions described below"],
      "else": ["list of actions described below"]
    }
    ```

- Emulate key press. Key codes could be retrieved from
  [node-key-sender](https://www.npmjs.com/package/node-key-sender#list-of-key-codes)

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
