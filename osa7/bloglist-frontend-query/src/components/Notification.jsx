import PropTypes from 'prop-types';
import { useNotification } from '../NotificationContext';

const Notification = () => {
  const [notification] = useNotification();

  if (!notification) {
    return null;
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    fontSize: '20px',
    color: notification.type === 'error' ? 'red' : 'green',
    borderColor: notification.type === 'error' ? 'red' : 'green',
  };

  return <div style={style}>{notification.message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
};

export default Notification;
