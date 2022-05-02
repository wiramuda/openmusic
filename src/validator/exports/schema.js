const Joi = require('joi');

const ExportsPayloadSchema = Joi.object({
    targetEmail: Joi.string().require().email({tlds:true})
});

module.exports = ExportsPayloadSchema;