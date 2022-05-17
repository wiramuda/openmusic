const Joi = require('joi');

const ExportsPayloadSchema = Joi.object({
  targetEmail: Joi.string().required().email({ tlds: true }),
});

module.exports = { ExportsPayloadSchema };
