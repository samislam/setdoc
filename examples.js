const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const app = express()
const { customSetDoc, customSetDocMw, customSendDocMw, SetDoc, SetDocMw, SendDocMw } = require('setDoc')
const { UserModel } = require('./models/UserModel')

app.use(express.json())

const customSetDoc = new SetDoc({
  notFoundMsg: 'Entschuldigung, aber der angeforderte Datensatz wurde nicht gefunden!',
  notFoundStatusCode: 500,
})
const customSetDocMw = new SetDocMw({
  notFoundMsg: 'üzgünüm, ancak istenen kayıt bulunamadı!',
})
const customSendDocMw = new SendDocMw({
  notFoundMsg: 'prepáčte, ale požadovaný záznam sa nenašiel!',
})

app.route('/api/users').get(
  customSetDocMw((req) => UserModel.find({}, { propName: 'docs' })),
  (req, res, next) => {
    res.status(200).json({ data: req.docs })
  }
)
app
  .route('/api/users/:id')
  .get(customSendDocMw((req) => UserModel.findById(req.params.id)))
  .patch(
    expressAsyncHandler(async (req, res, next) => {
      const doc = await customSetDoc(() => UserModel.findByIdAndUpdate(req.params.id, req.body))
      res.status(200).json({
        data: doc,
      })
    })
  )
app.use((err, req, res, next) => {
  if (err.name === 'setDocNotFoundError') {
    res.status(err.statusCode).json({
      message: err.message,
    })
  }
})
app.listen(3000, () => console.log('listening on port 3000...'))
