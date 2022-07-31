/*=============================================
=            importing dependencies            =
=============================================*/
const expressAsyncHandler = require('express-async-handler')
const { sendResMw } = require('@samislam/sendres')
const UserModel = require('./utils/UserModel')
const setDocMw = require('../src/setDocMw')
const express = require('express')
const getModel = require('./utils/getModel')

/*=====  End of importing dependencies  ======*/

const setDocMwRouter = express.Router()

setDocMwRouter.route('/').get(
  // ^ test #1
  //   setDocMw(() => UserModel.find()),
  // ^ test #2
  //   setDocMw(async () => (await getModel('User')).find()),
  // ^ test #3
  //   setDocMw(async () => (await getModel('User')).find().sort('name')),
  // ^ test #4
  //   setDocMw(async () =>
  //     (await getModel('User')).find().pre(function (next) {
  //       const query = this
  //       console.log('pre query hook method executed!')
  //       query.sort('name')
  //       next()
  //     })
  //   ),
  // ^ test #5
  //   setDocMw(async () =>
  //     (await getModel('User')).find().post(function (next) {
  //       const doc = this
  //       console.log('post hook method executed!')
  //       next()
  //     })
  //   ),
  // ^ test #6
  //   setDocMw(async () =>
  //     (await getModel('User')).find().transform(function (doc) {
  //       console.log('transform hook method executed!')
  //       return doc[1]
  //     })
  //   ),
  sendResMw(200, (req) => ({ data: req.mainDoc }))
)

setDocMwRouter.route('/:id').get(
  // ^ test #1
  //   setDocMw((req) => UserModel.findById(req.params.id), { notFoundErr: false }),
  // ^ test #2
  //   setDocMw(async (req) => (await getModel('User')).findById(req.params.id), { notFoundMsg: 'not found!' }),

  sendResMw(200, (req) => ({ data: req.mainDoc }))
)

/*----------  end of code, exporting  ----------*/
module.exports = setDocMwRouter
