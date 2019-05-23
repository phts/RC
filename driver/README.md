# arduino-pc-remote-control: driver

This is Node.js application which reads data from serial port written by [arduino](https://github.com/phts/remote-control/tree/master/firmware)
and performs actions mapped for the particular button on a remote control.

## Install

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
      "if": { "running": "mpc-hc.exe" },
      "then": { "key": "space" },
      "else": { "exec": ["c:\\Program Files (x86)\\foobar2000\\foobar2000.exe", "/play"] }
    },
    "rew": {
      "if": { "running": "mpc-hc.exe" },
      "then": { "key": ["shift", "left"] }
    },
    "ff": {
      "if": { "running": "mpc-hc.exe" },
      "then": { "key": ["shift", "right"] }
    }
  }
}
```

Key codes could be retrieved from
[node-key-sender](https://www.npmjs.com/package/node-key-sender#list-of-key-codes) component.
