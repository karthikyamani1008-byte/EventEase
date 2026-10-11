require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventease';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for Admin Provisioning...');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@eventease.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePass123!';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    // Check if an administrator already exists with this email
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`[Seed] Administrator account (${adminEmail}) already exists. Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    const passwordHash = await User.hashPassword(adminPassword);

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'admin',
      department: 'Office of Student Affairs',
      status: 'active',
    });

    console.log('---------------------------------------------------------');
    console.log('[Seed SUCCESS] Initial Administrator Provisioned:');
    console.log(` Name:     ${adminUser.name}`);
    console.log(` Email:    ${adminUser.email}`);
    console.log(` Role:     ${adminUser.role}`);
    console.log('---------------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed FAILED]:', error);
    process.exit(1);
  }
};

seedAdmin();
