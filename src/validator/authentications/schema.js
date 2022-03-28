const Joi = require('joi');

const AuthenticationsPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

module.exports = { AuthenticationsPayloadSchema };