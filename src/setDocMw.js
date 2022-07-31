/*=============================================
=            importing dependencies            =
=============================================*/
const getValue = require('./utils/getValue')
const checkTypes = require('@samislam/checktypes')
const { sendRes } = require('@samislam/sendres')
const NotFoundError = require('./utils/NotFoundError')
const getChosenOptions = require('./utils/getChosenOptions')
const expressAsyncHandler = require('express-async-handler')

/*=====  End of importing dependencies  ======*/

function setDocMw(queryFn, options) {
  // @param queryFn: function | asyncfunction
  // @param options: function | obj
  return expressAsyncHandler(async (req, res, next) => {
    // getting parameter values
    const optionsValue = await getValue(options, req)
    const chosenOptions = getChosenOptions(
      {
        // core options
        notFoundMsg: 'The resource you requested was not found',
        notFoundStatusCode: 404,
        notFoundErr: true,
        // middleware options
        handleNotFoundErr: true,
        callNext: true,
        // method options
        ifSinglePropName: 'mainDoc',
        ifMultiPropName: 'mainDocs',
        propName: undefined,
      },
      optionsValue
    )
    const resolvedQuery = await queryFn(req)
    if (!resolvedQuery && chosenOptions.notFoundErr) {
      if (chosenOptions.handleNotFoundErr) return sendRes(chosenOptions.notFoundStatusCode, res, { message: chosenOptions.notFoundMsg })
      else return next(new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode))
    }
    if (chosenOptions.propName) req[chosenOptions.propName] = resolvedQuery
    else {
      if (checkTypes.isArray(resolvedQuery)) req[chosenOptions.ifMultiPropName] = resolvedQuery
      else req[chosenOptions.ifSinglePropName] = resolvedQuery
    }
    if (chosenOptions.callNext) next()
  })
}

/*----------  end of code, exporting  ----------*/
module.exports = setDocMw
