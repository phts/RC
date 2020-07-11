'use strict'

let enabled = false

function enable() {
  enabled = true
}

function log(...args) {
  console.log(new Date().toLocaleTimeString(), ...args)
}

function input(...args) {
  if (!enabled) {
    return
  }
  log('>', ...args)
}

function output(...args) {
  if (!enabled) {
    return
  }
  log('<', ...args)
}

function internal(...args) {
  if (!enabled) {
    return
  }
  log('~', ...args)
}

module.exports = {
  enable,
  input,
  output,
  internal,
}
