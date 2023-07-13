const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// Get user notifications
router.get('/', authMiddleware, notificationController.getUserNotifications);
// Mark notification as read
router.put('/:id/mark-as-read', authMiddleware, notificationController.markNotificationAsRead);
// Delete notification
router.delete('/:id', authMiddleware, notificationController.deleteNotification);



module.exports = router;