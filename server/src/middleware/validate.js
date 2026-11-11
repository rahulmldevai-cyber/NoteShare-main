const ApiError = require('../utils/ApiError');

/**
 * Joi validation middleware factory
 * @param {Object} schema - Joi schema with body, params, query keys
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];

    ['body', 'params', 'query'].forEach((key) => {
      if (schema[key]) {
        const { error, value } = schema[key].validate(req[key], {
          abortEarly: false,
          stripUnknown: true,
          allowUnknown: false,
        });

        if (error) {
          const messages = error.details.map((detail) => detail.message);
          validationErrors.push(...messages);
        } else {
          req[key] = value; // Replace with sanitized values
        }
      }
    });

    if (validationErrors.length > 0) {
      throw ApiError.badRequest('Validation failed', validationErrors);
    }

    next();
  };
};

module.exports = validate;
