const ClientError = require('./ClientError');

class AuthenticationsError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'Authentications Error';
  }
}

module.exports = AuthenticationsError;
