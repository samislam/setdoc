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

function sendDocMw(queryFn, options) {
  // @param queryFn: function | asyncfunction
  // @param options: object
  return expressAsyncHandler(async (req, res, next) => {
    // getting the parameters values
    const optionsValue = await getValue(options, req)
    const chosenOptions = getChosenOptions(
      {
        // core options
        notFoundMsg: 'The resource you requested was not found',
        notFoundStatusCode: 404,
        notFoundErr: true,
        // method options
        handleNotFoundErr: true,
        callNext: false,
        // middleware options
        resBody: (doc) => (checkTypes.isArray(doc) ? { $$data: doc } : { data: doc }),
        sendRes: undefined,
        statusCode: 200,
      },
      optionsValue
    )
    const resolvedQuery = await queryFn(req)
    if (!resolvedQuery && chosenOptions.notFoundErr) {
      if (chosenOptions.handleNotFoundErr) return sendRes(chosenOptions.notFoundStatusCode, res, { message: chosenOptions.notFoundMsg })
      else return next(new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode))
    }

    sendRes(chosenOptions.statusCode, res, chosenOptions.resBody(resolvedQuery), chosenOptions.sendRes)
    if (chosenOptions.callNext) next()
  })
}

/*----------  end of code, exporting  ----------*/
module.exports = sendDocMw
