'use strict'

const settings = require('./settings.json')
const run = require('./lib/run')

async function test() {
  await run(settings.mappings.play)
}

setTimeout(test, 3000)
