/*=============================================
=            importing dependencies            =
=============================================*/
const mongoose = require('mongoose')
/*=====  End of importing dependencies  ======*/

const userSchema = new mongoose.Schema({
  name: String,
  subscribers: [{ email: String }],
})

userSchema.pre(/^find/, function (next) {
  const query = this
  console.log('schema pre find hook fired')
  query.findOne({ _archived: { $exists: false } }, null, { strictQuery: false })
  next()
})

userSchema.post(/^find/, function (doc) {
  console.log('schema post find hook fired')
})

const UserModel = mongoose.model('User', userSchema, 'users')
/*----------  end of code, exporting  ----------*/

module.exports = UserModel
