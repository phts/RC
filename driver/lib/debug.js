'use strict'

let enabled = false

function enable() {
  enabled = true
}

function input(...args) {
  if (!enabled) {
    return
  }
  console.log('>', ...args)
}

function output(...args) {
  if (!enabled) {
    return
  }
  console.log('<', ...args)
}

function internal(...args) {
  if (!enabled) {
    return
  }
  console.log('~', ...args)
}

module.exports = {
  enable,
  input,
  output,
  internal,
}
