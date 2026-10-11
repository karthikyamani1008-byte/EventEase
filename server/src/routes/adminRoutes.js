const express = require('express');
const {
  getAdminDashboard,
  getPendingEvents,
  updateEventApproval,
  getAdminUsers,
  updateUserStatus,
  getAdminEvents,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Strict RBAC: All admin endpoints require authentication AND role 'admin'
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/events/pending', getPendingEvents);
router.patch('/events/:id/approval', updateEventApproval);
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/events', getAdminEvents);

module.exports = router;
