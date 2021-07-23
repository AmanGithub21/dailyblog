const Joi = require('joi');

module.exports.blogSchema = Joi.object({
    blog: Joi.object({
        title: Joi.string().pattern(/^[^\s].*[^\s]$/).required(),
        content: Joi.string().required()
    }).required()
}).required();