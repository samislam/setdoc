/*=============================================
=            importing dependencies            =
=============================================*/
const express = require('express')
const log = require('@samislam/log')
const expressAsyncHandler = require('express-async-handler')
const factory = require('mmhf')
const { setDoc, setDocMw, globalOptions } = require('./..')
const { sendRes, sendResMw } = require('@samislam/sendres')
const { UserModel } = require('./mongoose_models')
const { default: mongoose } = require('mongoose')
/*=====  End of importing dependencies  ======*/

globalOptions.notFoundMsg = 'Die gesuchte Ressource konnte nicht gefunden werden'
globalOptions.ifMultiPropName = 'documents'

const app = express()
app.use(express.json())

app.post(
  '/users',
  factory.createOne(UserModel, (req) => req.body)
)

app.get(
  '/users',
  setDocMw(() => UserModel.find({}), {}),
  sendResMw(200, (req) => ({ $$data: req.documents }))
)

app.get(
  '/users/:id',
  setDocMw((req) => UserModel.findById(req.params.id), { ifSinglePropName: 'doc', handleError: false }),
  sendResMw(200, (req) => ({ data: req.doc }))
)

// app.get('/users', (req, res, next) => {
//   const docs = setDoc(() => UserModel.find({}), {})
//   sendRes(200, res, { $$data: docs })
// })

// app.get('/users/:id', async (req, res, next) => {
//   try {
//     const doc = await setDoc(() => UserModel.findById(req.params.id))
//     sendRes(200, res, { data: doc })
//   } catch (error) {
//     console.log(error.stack)
//     sendRes(error.statusCode, res, { message: error.message })
//   }
// })

app.use((err, req, res, next) => {
  console.log('caught')
  if (err.name === 'setDoc_404_error') {
    sendRes(err.statusCode, res, { message: err.message, foru2makesure: 'hi' })
  }
})

console.clear()

mongoose.connect('mongodb://localhost/tests', () => log.success(log.label, 'successfully connected to database'))
app.listen(9977, () => log.info(log.label, 'Test running on port 9977...'))
