const Joi = require('joi');

const signup = {
    body: Joi.object().keys({
        email: Joi.string().email().required().trim().lowercase(),
        password: Joi.string()
            .min(8)
            .required()
            .regex(/[a-z]/, 'lowercase letter')
            .regex(/[A-Z]/, 'uppercase letter')
            .regex(/[0-9]/, 'number')
            .regex(/[@$!%*?&]/, 'special character')
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.name': 'Password must include at least one {#name}',
            }),
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().email().required().trim().lowercase(),
        password: Joi.string(),
    }),
};
module.exports = {
    signup,
    login,
};
