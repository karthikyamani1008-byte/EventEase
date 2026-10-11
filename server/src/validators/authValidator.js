const AppError = require('../utils/appError');

const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !name.trim()) {
    return next(new AppError('Please provide your full name', 400));
  }

  if (!email || !email.trim()) {
    return next(new AppError('Please provide your email address', 400));
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email.trim())) {
    return next(new AppError('Please provide a valid email address format', 400));
  }

  if (!password || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  // Security constraint: Users CANNOT self-assign the Admin role
  if (role) {
    const normalizedRole = role.toLowerCase().trim();
    if (normalizedRole === 'admin') {
      return next(
        new AppError(
          'Security restriction: The Administrator role cannot be self-assigned during registration. Admin accounts are provisioned via system security seeds.',
          403
        )
      );
    }
    if (!['student', 'organizer'].includes(normalizedRole)) {
      return next(new AppError('Invalid role. Allowed registration roles are "student" or "organizer".', 400));
    }
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim() || !password) {
    return next(new AppError('Please provide both email and password', 400));
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
