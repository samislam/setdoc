/*=============================================
=            importing dependencies            =
=============================================*/
const checkTypes = require('@samislam/checktypes')

/*=====  End of importing dependencies  ======*/

const getValue = async (parameter, ...args) => (checkTypes.isAsycOrSyncFunc(parameter) ? await parameter(...args) : parameter)

/*----------  end of code, exporting  ----------*/

module.exports = getValue
