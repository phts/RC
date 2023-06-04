'use strict'

const {getInitialSettings} = require('./lib/settings')

const settings = getInitialSettings()

if (process.argv.includes('--test-mode')) {
  require('./lib/testMode')(settings).then(() => {
    process.exit()
  })
} else {
  require('./lib/app')(settings)
}
