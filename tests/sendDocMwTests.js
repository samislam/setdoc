/*=============================================
=            importing dependencies            =
=============================================*/
const expressAsyncHandler = require('express-async-handler')
const { sendResMw } = require('@samislam/sendres')
const UserModel = require('./utils/UserModel')
const sendDocMw = require('../src/sendDocMw')
const getModel = require('./utils/getModel')
const express = require('express')

/*=====  End of importing dependencies  ======*/

const sendDocMwRouter = express.Router()

sendDocMwRouter.route('/').get(
  () => console.log('uncomment and remove this middleware to test')
  // ^ test #1
  //   sendDocMw(() => UserModel.find())
  // ^ test #2
  //   sendDocMw(async () => (await getModel('User')).find())
  // ^ test #3
  //   sendDocMw(async () => (await getModel('User')).find().sort('name'))
  // ^ test #4
  //   sendDocMw(async () =>
  //     (await getModel('User')).find().pre(function (next) {
  //       const query = this
  //       console.log('pre query hook method executed!')
  //       query.sort('name')
  //       next()
  //     })
  //   )
  // ^ test #5
  // sendDocMw(async () =>
  //   (await getModel('User')).find().post(function (next) {
  //     const doc = this
  //     console.log('post hook method executed!')
  //     next()
  //   })
  // ),
  // ^ test #6
  // sendDocMw(async () =>
  //   (await getModel('User')).find().transform(function (doc) {
  //     console.log('transform hook method executed!')
  //     return doc[1]
  //   })
  // ),
)

sendDocMwRouter.route('/:id').get(
  () => console.log('uncomment and remove this middleware to test')
  // ^ test #1
  //   sendDocMw((req) => UserModel.findById(req.params.id), { notFoundErr: false }),
  // ^ test #2
  //   sendDocMw(async (req) => (await getModel('User')).findById(req.params.id), { notFoundMsg: 'not found!' }),
)

/*----------  end of code, exporting  ----------*/
module.exports = sendDocMwRouter
