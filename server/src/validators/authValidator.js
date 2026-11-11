const Joi = require('joi');

const register = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50).required()
      .messages({ 'string.min': 'Name must be at least 2 characters' }),
    email: Joi.string().email().lowercase().trim().required()
      .messages({ 'string.email': 'Please provide a valid email address' }),
    password: Joi.string().min(8).max(128).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    university: Joi.string().trim().max(100).optional(),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().email().lowercase().trim().required()
      .messages({ 'string.email': 'Please provide a valid email address' }),
    password: Joi.string().required()
      .messages({ 'any.required': 'Password is required' }),
  }),
};

const updateProfile = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50).optional(),
    university: Joi.string().trim().max(100).optional().allow(''),
    bio: Joi.string().trim().max(500).optional().allow(''),
    courses: Joi.array().items(Joi.string().trim()).max(20).optional(),
  }),
};

const changePassword = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        'string.min': 'New password must be at least 8 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, and a number',
      }),
  }),
};

module.exports = { register, login, updateProfile, changePassword };
