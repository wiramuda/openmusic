const InvariantError = require('../../exception/InvariantError');
const { AuthenticationsPayloadSchema } = require('./schema');

const AuthenticationsValidator = {
  validateAuthenticationsPayload: (payload) => {
    const validateResult = AuthenticationsPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
