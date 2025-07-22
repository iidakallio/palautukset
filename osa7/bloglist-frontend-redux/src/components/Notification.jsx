import React from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const message = useSelector(state => state.notification)
  if (!message) return null;

  const style = message.toLowerCase().includes('error') ? 'error' : 'success';
  return (
    <div className={style}>
      {message}
    </div>
  );
};


export default Notification;
