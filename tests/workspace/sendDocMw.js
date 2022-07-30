/*=============================================
=            importing dependencies            =
=============================================*/
const express = require('express')
const { sendDocMw } = require('../../src/index')
/*=====  End of importing dependencies  ======*/
const UserModel = require('./UserModel')
const getModel = require('./utils/getModel')
const getFuncName = require('./utils/getFuncName')
const { default: mongoose } = require('mongoose')

const router = express.Router()

router.route('/').get(
  sendDocMw((setQuery) => setQuery(UserModel.find()), {
    pre: (query) => query.sort('name'),
    post: (doc) => doc[1]
  })
)
/*----------  end of code, exporting  ----------*/
module.exports = router
