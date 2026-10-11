const jwt = require('jsonwebtoken');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'eventease-super-secret-jwt-fallback-key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

const sendTokenResponse = (user, statusCode, res, message = null) => {
  const token = signToken(user._id, user.role);

  // Cookie expiration (7 days)
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true, // Inaccessible to JavaScript document.cookie, prevents XSS token extraction
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    studentId: user.studentId,
    avatar: user.avatar,
    status: user.status,
    createdAt: user.createdAt,
  };

  return res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    token, // Also provided in JSON for clients preferring Authorization: Bearer <token>
    data: {
      user: userData,
    },
  });
};

module.exports = {
  signToken,
  sendTokenResponse,
};
