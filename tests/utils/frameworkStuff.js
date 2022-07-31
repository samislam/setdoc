/*=============================================
=            importing dependencies            =
=============================================*/
const mongoose = require('mongoose')
const log = require('@samislam/log')

/*=====  End of importing dependencies  ======*/

function frameworkStuff(app) {
  console.clear()
  log.info(log.label, 'connecting to the databsae...')
  mongoose.connect('mongodb://localhost:27017/tests').then(() => {
    log.success(log.label, 'successfully connected to database')
    log.info(log.label, 'starting the http service...')
    app.listen(9977, () => log.success(log.label, 'Test running on [http://localhost:9977]'))
  })
}

module.exports = frameworkStuff
