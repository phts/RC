'use strict'

const storage = require('../../storage')

module.exports = async (operand) => operand === storage.getCurrentValue()
