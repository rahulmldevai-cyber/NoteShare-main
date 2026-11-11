const Joi = require('joi');

const createComment = {
  body: Joi.object({
    content: Joi.string().trim().min(1).max(1000).required()
      .messages({ 'string.min': 'Comment cannot be empty' }),
    parentComment: Joi.string().hex().length(24).optional()
      .messages({ 'string.hex': 'Invalid parent comment ID' }),
  }),
};

const updateComment = {
  body: Joi.object({
    content: Joi.string().trim().min(1).max(1000).required(),
  }),
};

module.exports = { createComment, updateComment };
