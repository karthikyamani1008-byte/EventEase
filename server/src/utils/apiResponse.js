/**
 * Standard API response helper
 */
const sendResponse = (res, statusCode, data, message = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
  };

  if (message) {
    response.message = message;
  }

  if (data !== undefined && data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
};
