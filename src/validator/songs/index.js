const InvariantError = require('../../exception/InvariantError');
const { SongsPayloadSchema } = require('./schema');

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const validateResult = SongsPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = SongsValidator;
