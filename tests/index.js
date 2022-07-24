/*=============================================
=            importing dependencies            =
=============================================*/
const express = require('express')
const log = require('@samislam/log')
const expressAsyncHandler = require('express-async-handler')
const factory = require('mmhf')
const { sendRes, sendResMw } = require('@samislam/sendres')
const { UserModel } = require('./mongoose_models')
const { default: mongoose } = require('mongoose')
const { setDoc, setDocMw, sendDocMw, SetDoc, SetDocMw, SendDocMw } = require('./../src')
/*=====  End of importing dependencies  ======*/

const app = express()
app.use(express.json())

const setDocMwNew = new SetDocMw({
  notFoundMsg: 'ooh, boy, nothing was found!',
}).method

const router = express.Router()

app.use('/api/users', router)

router.route('/').get(sendDocMw(() => UserModel.find()))
router
  .route('/:id')
  .get(sendDocMw((req) => UserModel.findById(req.params.id)))
  .patch(
    setDocMwNew((req) => UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })),
    sendResMw(200, (req) => ({ data: req.mainDoc }))
  )
  .delete(
    expressAsyncHandler(async (req, res, next) => {
      const doc = await setDoc(() => UserModel.findByIdAndDelete(req.params.id))
      sendRes(204, res, { data: null })
    })
  )

app.use((err, req, res, next) => {
  console.log('caught')
  if (err.name === 'setDocNotFoundError') {
    sendRes(err.statusCode, res, { message: err.message, foru2makesure: 'hi' })
  } else console.log(err)
})

/*=============================================
=            framework stuff            =
=============================================*/

console.clear()

function main() {
  log.info(log.label, 'connecting to the databsae...')
  mongoose.connect('mongodb://localhost:27017/tests').then(() => {
    log.success(log.label, 'successfully connected to database')
    log.info(log.label, 'starting the http service...')
    app.listen(9977, () => log.info(log.label, 'Test running on port 9977...'))
  })
}
main()

/*=====  End of framework stuff  ======*/
