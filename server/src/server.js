require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start listening
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[EventEase Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[EventEase Server] Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`[EventEase Server] Events catalog: http://localhost:${PORT}/api/v1/events`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('[FATAL] Unhandled Rejection:', err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
