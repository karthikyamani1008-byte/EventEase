const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventease';
    
    const conn = await mongoose.connect(uri, {
      autoIndex: true, // Build indexes in development
    });

    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    console.error('Please verify that MONGODB_URI is correctly set in server/.env (or local MongoDB service is running).');
    process.exit(1);
  }
};

module.exports = connectDB;
