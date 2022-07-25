/*=============================================
=            importing dependencies            =
=============================================*/
const _ = require('lodash')
const expressAsyncHandler = require('express-async-handler')
const checkTypes = require('@samislam/checktypes')
const { sendRes } = require('@samislam/sendres')
const getValue = require('./utils/getValue')
const NotFoundError = require('./utils/NotFoundError')
/*=====  End of importing dependencies  ======*/

const notFoundDefaultMsg = 'The resource you requested was not found'

class SetDoc {
  constructor(options = {}) {
    this.options = options
  }
  method = async (query, options) => {
    // @param query: mongooseQuery
    // @param options: object
    // getting the parameters values
    const queryValue = await getValue(query)
    // working with the options -----
    const chosenOptions = {}
    const defaultOptions = {
      notFoundErr: true,
      notFoundMsg: notFoundDefaultMsg,
      notFoundStatusCode: 404,
    }
    _.merge(chosenOptions, defaultOptions, this.options, options)
    // working with the main code -----
    const dbRes = await queryValue
    if (checkTypes.isUndefined(dbRes) && chosenOptions.notFoundErr)
      throw new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode)
    else return dbRes
  }
}

class SetDocMw {
  constructor(options = {}) {
    this.options = options
  }
  method = (query, options) => {
    // @param query: function
    // @param options: function | obj
    return expressAsyncHandler(async (req, res, next) => {
      // getting parameter values
      const queryValue = await getValue(query, req)
      const optionsValue = await getValue(options, req)
      // working with the options -----
      const chosenOptions = {}
      const defaultOptions = {
        notFoundErr: true,
        notFoundMsg: notFoundDefaultMsg,
        notFoundStatusCode: 404,
        post: (doc) => doc,
        handleNotFoundError: true,
        callNext: true,
        propName: undefined,
        ifSinglePropName: 'mainDoc',
        ifMultiPropName: 'mainDocs',
      }
      _.merge(chosenOptions, defaultOptions, this.options, optionsValue)
      // working with the main code -----
      const dbRes = await queryValue

      if (checkTypes.isUndefined(dbRes) && chosenOptions.notFoundErr) {
        if (chosenOptions.handleNotFoundError) return sendRes(chosenOptions.notFoundStatusCode, res, { message: chosenOptions.notFoundMsg })
        else return next(new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode))
      }

      const postDoc = await chosenOptions.post(dbRes)

      if (chosenOptions.propName) req[chosenOptions.propName] = postDoc
      else {
        if (checkTypes.isArray(postDoc)) req[chosenOptions.ifMultiPropName] = postDoc
        else req[chosenOptions.ifSinglePropName] = postDoc
      }
      if (chosenOptions.callNext) next()
    })
  }
}

class SendDocMw {
  constructor(options = {}) {
    this.options = options
  }
  method = (query, options) => {
    // @param query: mongooseQuery
    // @param options: object
    // getting the parameters values
    return expressAsyncHandler(async (req, res, next) => {
      const queryValue = await getValue(query, req)
      // working with the options -----
      const chosenOptions = {}
      const defaultOptions = {
        notFoundMsg: notFoundDefaultMsg,
        notFoundStatusCode: 404,
        notFoundErr: true,
        post: (doc) => doc,
        handleNotFoundError: true,
        callNext: false,
        statusCode: 200,
        response: (doc) => (checkTypes.isArray(doc) ? { $$data: doc } : { data: doc }),
        sendRes: {},
      }
      _.merge(chosenOptions, defaultOptions, this.options, options)
      // working with the main code -----
      const dbRes = await queryValue
      if (checkTypes.isNull(dbRes) && chosenOptions.notFoundErr) {
        if (chosenOptions.handleNotFoundError) return sendRes(chosenOptions.notFoundStatusCode, res, { message: chosenOptions.notFoundMsg })
        else return next(new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode))
      }

      const postDoc = await chosenOptions.post(dbRes)
      sendRes(chosenOptions.statusCode, res, chosenOptions.response(postDoc), chosenOptions.sendRes)
      if (chosenOptions.callNext) next()
    })
  }
}

const setDoc = new SetDoc().method
const setDocMw = new SetDocMw().method
const sendDocMw = new SendDocMw().method

/*----------  end of code, exporting  ----------*/

module.exports = {
  SetDoc,
  setDoc,
  SetDocMw,
  setDocMw,
  SendDocMw,
  sendDocMw,
}
