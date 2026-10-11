const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');

/**
 * Protect routes - Verifies JWT from HttpOnly cookie or Authorization Bearer header
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check HttpOnly cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback to Authorization: Bearer <token> header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('Authentication required. Please log in to access this resource.', 401)
      );
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'eventease-super-secret-jwt-fallback-key'
      );
    } catch (err) {
      return next(
        new AppError('Invalid or expired authentication token. Please log in again.', 401)
      );
    }

    // 4. Check if user still exists in database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user account belonging to this token no longer exists.', 401)
      );
    }

    // 5. Check if user account is active
    if (currentUser.status === 'suspended') {
      return next(
        new AppError(
          'Your account has been suspended. Please contact the campus platform administration.',
          403
        )
      );
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * Restricts route access to specified roles e.g. authorize('admin', 'organizer')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden: Your role (${req.user?.role || 'anonymous'}) is not authorized to perform this action.`,
          403
        )
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
