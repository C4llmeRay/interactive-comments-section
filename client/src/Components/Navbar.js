import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { getUserNotifications } from '../api';
import '../Styles/Navbar.css'

function Navbar({ isLoggedIn }) {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    checkUnreadNotifications();
  }, []);

  const checkUnreadNotifications = () => {
    getUserNotifications()
      .then((response) => {
        const notifications = response.data;
        const hasUnread = notifications.some((notification) => !notification.read);
        setHasUnreadNotifications(hasUnread);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/userComments">
                My Comments
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/notification">
                <FontAwesomeIcon
                  icon={faBell}
                  className={hasUnreadNotifications ? 'notification-icon active' : 'notification-icon'}
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
