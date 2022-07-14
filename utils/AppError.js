class AppError extends Error {
  constructor(message, statusCode, name) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    this.name = name

    Error.captureStackTrace(this, this.constructor)
  }
}

/*----------  end of code, exporting  ----------*/

module.exports = AppError
