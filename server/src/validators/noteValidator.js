const Joi = require('joi');

const createNote = {
  body: Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    description: Joi.string().trim().max(2000).required(),
    subject: Joi.string().trim().required(),
    course: Joi.string().trim().required(),
    semester: Joi.number().integer().min(1).max(8).required(),
    university: Joi.string().trim().max(100).optional(),
    tags: Joi.alternatives().try(
      Joi.array().items(Joi.string().trim().lowercase()).max(10),
      Joi.string().trim()
    ).optional(),
  }),
};

const updateNote = {
  body: Joi.object({
    title: Joi.string().trim().min(3).max(200).optional(),
    description: Joi.string().trim().max(2000).optional(),
    subject: Joi.string().trim().optional(),
    course: Joi.string().trim().optional(),
    semester: Joi.number().integer().min(1).max(8).optional(),
    university: Joi.string().trim().max(100).optional(),
    tags: Joi.alternatives().try(
      Joi.array().items(Joi.string().trim().lowercase()).max(10),
      Joi.string().trim()
    ).optional(),
  }),
};

const queryNotes = {
  query: Joi.object({
    search: Joi.string().trim().max(200).optional(),
    subject: Joi.string().trim().optional(),
    course: Joi.string().trim().optional(),
    semester: Joi.number().integer().min(1).max(8).optional(),
    sort: Joi.string().valid('latest', 'oldest', 'popular', 'rating', 'downloads').default('latest'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(12),
  }),
};

module.exports = { createNote, updateNote, queryNotes };
