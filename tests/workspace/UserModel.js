/*=============================================
=            importing dependencies            =
=============================================*/
const mongoose = require('mongoose')
/*=====  End of importing dependencies  ======*/

const userSchema = new mongoose.Schema({
  name: String,
  subscribers: [{ email: String }],
})

const UserModel = mongoose.model('User', userSchema, 'users')
/*----------  end of code, exporting  ----------*/

module.exports = UserModel