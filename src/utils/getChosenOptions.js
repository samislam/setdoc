/*=============================================
=            importing dependencies            =
=============================================*/
const _ = require('lodash')
/*=====  End of importing dependencies  ======*/

function getChosenOptions(defaultOptions, ...overwritings) {
  const chosenOptions = {}
  _.merge(chosenOptions, defaultOptions, ...overwritings)
  return chosenOptions
}

/*----------  end of code, exporting  ----------*/

module.exports = getChosenOptions
