class AppError extends Error {
  constructor(message, statusCode, errName) {
    super(message)

    this.statusCode = statusCode
    this.name = errName

    Error.captureStackTrace(this, this.constructor)
  }
}

/*----------  end of code, exporting  ----------*/

module.exports = AppError
