class AppError extends Error {
  constructor(message, statusCode, errName) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.name = errName

    Error.captureStackTrace(this, this.constructor)
  }
}

/*----------  end of code, exporting  ----------*/

module.exports = AppError
