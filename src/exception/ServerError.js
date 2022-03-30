class ServerError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'Server error';
  }

  toString() {
    return {
      status: 'error',
      message: this.message,
    };
  }
}
module.exports = ServerError;
