// components/Notification.js
import React, { useEffect } from "react";

function Notification({ message, type = "success", isVisible, setIsVisible }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Auto-hide after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, setIsVisible]);

  if (!isVisible) return null;

  return (
    <div className="notification">
      <div className={`notification-content notification-${type}`}>
        <div className="notification-text">{message}</div>
        <button 
          onClick={() => setIsVisible(false)} 
          className="close-button"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Notification;