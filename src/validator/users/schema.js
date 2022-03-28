const Joi = require("joi");

const userSchema = new Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
});

module.exports = { userSchema };