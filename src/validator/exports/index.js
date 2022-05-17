const InvariantError = require('../../exception/InvariantError');
const { ExportsPayloadSchema } = require('./schema');

const ExportValidator = {
  validateExportspayload: (payload) => {
    const result = ExportsPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = { ExportValidator };
