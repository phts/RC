'use strict'

const psList = require('ps-list')

module.exports = async (operand) => !!(await psList()).find((x) => x.name === operand)
