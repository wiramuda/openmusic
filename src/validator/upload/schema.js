const Joi = require('joi');

const UploadPayloadschema = Joi.object({
    'content-type': Joi.string().valid('image/apng','image/avif','image/gif','image/jpg','image/jpeg','image/webp').required(),
}).unknown();

module.exports = { UploadPayloadschema };