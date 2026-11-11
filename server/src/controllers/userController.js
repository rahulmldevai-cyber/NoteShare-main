const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, university, bio, courses } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, university, bio, courses },
    { new: true, runValidators: true }
  );

  new ApiResponse(200, { user }, 'Profile updated successfully').send(res);
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/users/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  new ApiResponse(200, null, 'Password changed successfully').send(res);
});

/**
 * @desc    Get user's public profile
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('name avatar university bio courses createdAt');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  new ApiResponse(200, { user }).send(res);
});

module.exports = { updateProfile, changePassword, getUserProfile };
