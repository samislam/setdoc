const setDoc = require('./setDoc')
const setDocMw = require('./setDocMw')
const sendDocMw = require('./sendDocMw')

module.exports = {
  // ? the exportings here are public and are aimed to be used by the controllers, (the consumer of the module)
  setDoc,
  setDocMw,
  sendDocMw,
}
