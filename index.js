/*=============================================
=            importing dependencies            =
=============================================*/
const _ = require('lodash')
const expressAsyncHandler = require('express-async-handler')
const checkTypes = require('@samislam/checktypes')
const { sendRes } = require('@samislam/sendres')
const mongoose = require('mongoose')

const AppError = require('./utils/AppError')

/*=====  End of importing dependencies  ======*/

function sendErr(res, statusCode, message) {
  sendRes(statusCode, res, { message })
}

const getValue = async (parameter, ...args) => (checkTypes.isAsycOrSyncFunc(parameter) ? await parameter(...args) : parameter)

const globalOptions = {
  notFoundMsg: 'The resource you requested was not found',
  notFoundStatusCode: 404,
  notFoundErr: true,
  propName: undefined,
  ifSinglePropName: 'mainDoc',
  ifMultiPropName: 'mainDocs',
  handleError: true,
}

function setDocMw(query, options) {
  // @param query: function
  // @param options: function | obj
  return expressAsyncHandler(async (req, res, next) => {
    // getting parameter values
    const queryValue = await getValue(query, req)
    const optionsValue = await getValue(options, req)
    // working with the options -----
    const chosenOptions = {}
    const defaultOptions = {
      notFoundErr: globalOptions.notFoundErr,
      notFoundMsg: globalOptions.notFoundMsg,
      notFoundStatusCode: globalOptions.notFoundStatusCode,
      propName: globalOptions.propName,
      ifSinglePropName: globalOptions.ifSinglePropName,
      ifMultiPropName: globalOptions.ifMultiPropName,
      handleError: globalOptions.handleError,
    }
    _.merge(chosenOptions, defaultOptions, optionsValue)
    // working with the main code -----
    const dbRes = await queryValue

    if (!dbRes && chosenOptions.notFoundErr) {
      if (chosenOptions.handleError) return sendErr(res, chosenOptions.notFoundStatusCode, chosenOptions.notFoundMsg)
      else return next(new AppError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode, 'setDoc_404_error'))
    }
    if (chosenOptions.propName) req[chosenOptions.propName] = dbRes
    else {
      if (checkTypes.isArray(dbRes)) req[chosenOptions.ifMultiPropName] = dbRes
      else req[chosenOptions.ifSinglePropName] = dbRes
    }
    return next()
  })
}
async function setDoc(query, options) {
  // @param query: mongooseQuery
  // @param options: object
  // getting the parameters values
  const queryValue = await getValue(query)
  // working with the options -----
  const chosenOptions = {}
  const defaultOptions = {
    notFoundErr: globalOptions.notFoundErr,
    notFoundMsg: globalOptions.notFoundMsg,
    notFoundStatusCode: globalOptions.notFoundStatusCode,
  }
  _.merge(chosenOptions, defaultOptions, options)
  // working with the main code -----
  const dbRes = await queryValue
  if (!dbRes && chosenOptions.notFoundErr) throw new AppError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode, 'setDoc_404_error')
  else return dbRes
}

/*----------  end of code, exporting  ----------*/

module.exports = {
  globalOptions,
  setDocMw,
  setDoc,
}
