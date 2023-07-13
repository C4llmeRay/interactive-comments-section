const Notification = require('../models/notification');

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId });
    res.send(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send({ msg: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // Find the notification by ID and update the read status
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );

    if (notification) {
      res.send({ msg: 'Notification marked as read' });
    } else {
      res.status(404).send({ msg: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send({ msg: 'Failed to mark notification as read' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // Find the notification by ID and remove it
    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });

    if (deletedNotification) {
      res.send({ msg: 'Notification deleted successfully' });
    } else {
      res.status(404).send({ msg: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).send({ msg: 'Failed to delete notification' });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
};
