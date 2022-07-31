const UserModel = require('./UserModel')

async function getModel(modelName) {
  switch (modelName) {
    case 'User':
      return UserModel
  }
}

module.exports = getModel
