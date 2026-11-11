const mongoSanitize = require('express-mongo-sanitize');

/**
 * Input sanitization middleware
 * Prevents NoSQL injection by removing $ and . from user input
 */
const sanitize = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized input on ${key} from ${req.ip}`);
  },
});

module.exports = sanitize;
