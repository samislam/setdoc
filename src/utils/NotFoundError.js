class AppError extends Error {
  constructor(message, statusCode) {
    super(message)

    this.name = 'setDocNotFoundError'
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}

/*----------  end of code, exporting  ----------*/

module.exports = AppError
