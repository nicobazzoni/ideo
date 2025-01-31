// src/components/NotificationButton.jsx
import React, { useEffect } from 'react';
import { messaging } from '../firebase';
import { getToken } from 'firebase/messaging';

const NotificationButton = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
          console.log('FCM Token:', token);
          // Send the token to your server to store and use for sending notifications
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('Error obtaining notification permission or token:', error);
      }
    };

    requestPermission();
  }, []);

  return <button>Enable Notifications</button>;
};

export default NotificationButton;