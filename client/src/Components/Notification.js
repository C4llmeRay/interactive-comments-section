import React, { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead, deleteNotification, getOneComment } from '../api';
import '../Styles/Notification.css'

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    getUserNotifications()
      .then((response) => {
        console.log('Notifications response:', response);
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  };

  const handleNotificationClick = (notificationId) => {
    markNotificationAsRead(notificationId)
      .then(() => {
        console.log('Notification marked as read');
        fetchNotifications();
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  };

  const handleNotificationDelete = (notificationId) => {
    deleteNotification(notificationId)
      .then(() => {
        console.log('Notification deleted successfully');
        fetchNotifications();
      })
      .catch((error) => {
        console.error('Error deleting notification:', error);
      });
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const [notificationTexts, setNotificationTexts] = useState({});

  useEffect(() => {
    const fetchNotificationTexts = async () => {
      const updatedTexts = {};

      for (const notification of notifications) {
        if (notification.commentId) {
          try {
            const comment = await getOneComment(notification.commentId);
            updatedTexts[notification._id] = generateNotificationText(notification, comment.data.content);
          } catch (error) {
            console.error('Error fetching comment:', error);
            updatedTexts[notification._id] = '';
          }
        } else {
          updatedTexts[notification._id] = generateNotificationText(notification, '');
        }
      }

      setNotificationTexts(updatedTexts);
    };

    fetchNotificationTexts();
  }, [notifications]);

  const generateNotificationText = (notification, commentContent) => {
    switch (notification.type) {
      case 'reply':
        if (commentContent) {
          return `You have a new reply to your comment: ${commentContent}`;
        } else {
          return 'You have a new reply to your comment.';
        }
      default:
        return 'New notification';
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => handleNotificationClick(notification._id)}
          >
            <p>{notificationTexts[notification._id]}</p>
            <p>{formatDateTime(notification.createdAt)}</p>
            {notification.read ? (
              <span className="notification-status">Read</span>
            ) : (
              <span className="notification-status">Unread</span>
            )}
            <button onClick={() => handleNotificationDelete(notification._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
}

export default Notification;
