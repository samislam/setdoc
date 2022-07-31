/*=============================================
=            importing dependencies            =
=============================================*/
const expressAsyncHandler = require('express-async-handler')
const { sendRes } = require('@samislam/sendres')
const UserModel = require('./utils/UserModel')
const setDoc = require('../src/setDoc')
const getModel = require('./utils/getModel')
const express = require('express')

/*=====  End of importing dependencies  ======*/

const setDocRouter = express.Router()

setDocRouter.route('/').get(
  expressAsyncHandler(async (req, res, next) => {
    // ^ test #1
    // const docs = await setDoc(() => UserModel.find())

    // ^ test #2
    // const docs = await setDoc(async () => (await getModel('User')).find())

    // ^ test #3
    // const docs = await setDoc(async () => (await getModel('User')).find().sort('name'))

    // ^ test #4
    // const docs = await setDoc(async () =>
    //   (await getModel('User')).find().pre(function (next) {
    //     const query = this
    //     console.log('pre query hook method executed!')
    //     query.sort('name')
    //     next()
    //   })
    // )

    // ^ test #5
    // const docs = await setDoc(async () =>
    //   (await getModel('User')).find().post(function (next) {
    //     const doc = this
    //     console.log('post hook method executed!')
    //     next()
    //   })
    // )

    // ^ test #6
    // const docs = await setDoc(async () =>
    //   (await getModel('User')).find().transform(function (doc) {
    //     console.log('transform hook method executed!', doc)
    //     return doc[1]
    //   })
    // )

    sendRes(200, res, { $$data: docs })
  })
)

setDocRouter.route('/:id').get(
  expressAsyncHandler(async (req, res, next) => {
    // ^ test #1
    // const doc = await setDoc(() => UserModel.findById(req.params.id), { notFoundErr: false })
    // ^ test #2
    // const doc = await setDoc(async () => (await getModel('User')).findById(req.params.id), { notFoundMsg: 'not found!' })

    sendRes(200, res, { data: doc })
  })
)

/*----------  end of code, exporting  ----------*/
module.exports = setDocRouter
