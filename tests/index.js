/*=============================================
=            importing dependencies            =
=============================================*/
const express = require('express')
const frameworkStuff = require('./utils/frameworkStuff')
/*=====  End of importing dependencies  ======*/

const app = express()
app.use(express.json())

app.use('/setDocTests', require('./setDocTests'))
app.use('/setDocMwTests', require('./setDocMwTests'))
app.use('/sendDocMwTests', require('./sendDocMwTests'))

app.use((err, req, res, next) => {
  console.log('global error handling middleware caught an error')
  if (err.name === 'setDocNotFoundError') {
    res.status(err.statusCode).json({ status: 'error', message: err.message })
  } else {
    res.end('internal server error, read the console for details')
    console.error(err)
  }
})

frameworkStuff(app)
