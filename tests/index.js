/*=============================================
=            importing dependencies            =
=============================================*/
const log = require('@samislam/log')
const express = require('express')
const mongoose = require('mongoose')
/*=====  End of importing dependencies  ======*/

const app = express()
app.use(express.json())

app.use('/tests', require('./workspace/sendDocMw'))

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
