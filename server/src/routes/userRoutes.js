const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfile: profileSchema, changePassword: passSchema } = require('../validators/authValidator');

router.put('/profile', protect, validate(profileSchema), updateProfile);
router.put('/change-password', protect, validate(passSchema), changePassword);
router.get('/:id', getUserProfile);

module.exports = router;
