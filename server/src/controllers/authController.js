const User = require('../models/User');
const AppError = require('../utils/appError');
const { sendTokenResponse } = require('../utils/generateToken');
const { sendResponse } = require('../utils/apiResponse');

/**
 * @desc    Register a new student or club organizer
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', department, studentId } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(new AppError('An account with this email address already exists. Please log in.', 400));
    }

    // Hash plain-text password using User model helper
    const passwordHash = await User.hashPassword(password);

    // Create user record
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: role.toLowerCase().trim(),
      department: department ? department.trim() : '',
      studentId: studentId ? studentId.trim() : '',
      status: 'active',
    });

    return sendTokenResponse(user, 201, res, 'Registration completed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Query user and explicitly select passwordHash
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Verify account is not suspended
    if (user.status === 'suspended') {
      return next(
        new AppError('Your account has been suspended. Please contact platform administrators.', 403)
      );
    }

    return sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out user & clear HttpOnly cookie
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000), // Expire in 5 seconds
    httpOnly: true,
  });

  return sendResponse(res, 200, null, 'Logged out successfully');
};

/**
 * @desc    Get currently authenticated user profile
 * @route   GET /api/v1/auth/me
 * @access  Private (Protected)
 */
const getMe = async (req, res, next) => {
  try {
    return sendResponse(res, 200, { user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
