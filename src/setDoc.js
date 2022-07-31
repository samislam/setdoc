/*=============================================
=            importing dependencies            =
=============================================*/
const getChosenOptions = require('./utils/getChosenOptions')
const NotFoundError = require('./utils/NotFoundError')

/*=====  End of importing dependencies  ======*/

async function setDoc(queryFn, options) {
  // @param queryFn: function | asyncfunction
  // @param options: object
  // getting the parameters values
  const chosenOptions = getChosenOptions(
    {
      // core options
      notFoundMsg: 'The resource you requested was not found',
      notFoundStatusCode: 404,
      notFoundErr: true,
    },
    options
  )

  const resolvedQuery = await queryFn()
  if (!resolvedQuery && chosenOptions.notFoundErr) throw new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode)
  return resolvedQuery
}

/*----------  end of code, exporting  ----------*/
module.exports = setDoc
