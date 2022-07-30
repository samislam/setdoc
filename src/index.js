/*=============================================
=            importing dependencies            =
=============================================*/
const getValue = require('./utils/getValue')
const checkTypes = require('@samislam/checktypes')
const { sendRes } = require('@samislam/sendres')
const NotFoundError = require('./utils/NotFoundError')
const getChosenOptions = require('./utils/getChosenOptions')
const expressAsyncHandler = require('express-async-handler')
const { default: mongoose } = require('mongoose')
/*=====  End of importing dependencies  ======*/

const notFoundDefaultMsg = 'The resource you requested was not found'

class SetDoc {
  constructor(options) {
    // @param options: object
    this.options = options
    this.defaultOptions = {
      notFoundMsg: notFoundDefaultMsg,
      notFoundStatusCode: 404,
      pre: (query) => query,
      post: (doc) => doc,
      notFoundErr: true,
    }
    this.chosenOptions = getChosenOptions(this.defaultOptions, this.options)
  }
  method = async (query, options) => {
    // @param query: function
    // @param options: object
    // getting the parameters values
    let queryValue
    const setQuery = (query) => {
      queryValue = query
    }
    await query(setQuery)
    const chosenOptions = getChosenOptions(this.chosenOptions, options)
    // & pre query hook -----
    chosenOptions.pre(queryValue)
    const dbRes = await queryValue
    if (!dbRes && chosenOptions.notFoundErr) throw new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode)
    // & post doc hook -----
    let postDoc = chosenOptions.post(dbRes)
    postDoc = checkTypes.isUndefined(postDoc) ? dbRes : postDoc
    return postDoc
  }
}

class SetDocMw {
  constructor(options) {
    // @param options: object
    this.options = options
    this.defaultOptions = {
      notFoundMsg: notFoundDefaultMsg,
      ifSinglePropName: 'mainDoc',
      ifMultiPropName: 'mainDocs',
      handleNotFoundErr: true,
      notFoundStatusCode: 404,
      pre: (query) => query,
      propName: undefined,
      post: (doc) => doc,
      notFoundErr: true,
      callNext: true,
    }
    this.chosenOptions = getChosenOptions(this.defaultOptions, this.options)
  }
  method = (query, options) => {
    // @param query: function
    // @param options: function | obj
    return expressAsyncHandler(async (req, res, next) => {
      // getting parameter values
      let queryValue
      const setQuery = (query) => {
        queryValue = query
      }
      await query(setQuery, req)
      const optionsValue = await getValue(options, req)
      const chosenOptions = getChosenOptions(this.chosenOptions, optionsValue)
      // & pre query hook -----
      chosenOptions.pre(queryValue)
      const dbRes = await queryValue
      if (!dbRes && chosenOptions.notFoundErr) {
        if (chosenOptions.handleNotFoundErr) return sendRes(chosenOptions.notFoundStatusCode, res, { message: chosenOptions.notFoundMsg })
        else return next(new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode))
      }
      // & post doc hook -----
      let postDoc = chosenOptions.post(dbRes)
      postDoc = checkTypes.isUndefined(postDoc) ? dbRes : postDoc
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
  constructor(options) {
    // @param options: object
    this.options = options
    this.defaultOptions = {
      resBody: (doc) => (checkTypes.isArray(doc) ? { $$data: doc } : { data: doc }),
      notFoundMsg: notFoundDefaultMsg,
      notFoundStatusCode: 404,
      handleNotFoundErr: true,
      pre: async (query) => query,
      post: (doc) => doc,
      sendRes: undefined,
      notFoundErr: true,
      callNext: false,
      statusCode: 200,
    }
    this.chosenOptions = getChosenOptions(this.defaultOptions, this.options)
  }
  method = (query, options) => {
    // @param query: function (not async)
    // @param options: object
    return expressAsyncHandler(async (req, res, next) => {
      // getting the parameters values
      let queryValue
      const setQuery = (query) => {
        queryValue = query
      }
      await query(setQuery, req)
      const optionsValue = await getValue(options, req)
      const chosenOptions = getChosenOptions(this.chosenOptions, optionsValue)
      // & pre query hook -----
      chosenOptions.pre(queryValue)
      const dbRes = await queryValue
      if (!dbRes && chosenOptions.notFoundErr) {
        if (chosenOptions.handleNotFoundErr) return sendRes(chosenOptions.notFoundStatusCode, res, { message: chosenOptions.notFoundMsg })
        else return next(new NotFoundError(chosenOptions.notFoundMsg, chosenOptions.notFoundStatusCode))
      }

      // & post doc hook -----
      let postDoc = chosenOptions.post(dbRes)
      postDoc = checkTypes.isUndefined(postDoc) ? dbRes : postDoc
      sendRes(chosenOptions.statusCode, res, chosenOptions.resBody(postDoc), chosenOptions.sendRes)
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
