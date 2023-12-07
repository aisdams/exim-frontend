import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { NotificationCenter } from '@novu/notification-center';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const theme = {
  dark: {
    layout: {
      background: '#1A1A1A',
    },
    header: {
      badgeColor: '#FFE14D',
      badgeTextColor: '#000',
    },
    notificationItem: {
      id: '',
      avatar: '',
      title: '',
      body: '',
      timestamp: 0,
      unread: {
        fontColor: '#FFFFFF', // Example value - adjust as needed
        background: '#FF0000', // Example value - adjust as needed
        // Add other properties as expected by INovuThemeProvider for 'unread'
      },
    },
    popover: {
      arrowColor: '#1A1A1A',
    },
    loaderColor: '#FFE14D',
  },
};

const footer = () => (
  <footer className="text-gray-5 row-start-3 py-3 text-center text-[13px] leading-none">
    Powered by{' '}
    <a
      className="text-white"
      href="https://novu.co/"
      target="_blank"
      rel="noreferrer"
    >
      Novu
    </a>
  </footer>
);

interface NotificationsProps {
  className?: string | null;
  offset?: number; // Add 'offset' as a prop here
}

const NotificationsContainer: React.FC<NotificationsProps> = ({
  className,
  offset = 20, // Default value for offset
  ...otherProps
}) => {
  const onNotificationClick = useCallback((notification: any) => {
    if (notification?.cta?.data?.url) {
      window.location.href = notification.cta.data.url;
    }
  }, []);

  return (
    <div className={clsx('notification-center-wrapper', className)}>
      <NotificationCenter
        colorScheme="dark"
        theme={theme}
        footer={footer}
        showUserPreferences={false}
        onNotificationClick={onNotificationClick}
        {...otherProps}
      />
    </div>
  );
};

NotificationsContainer.propTypes = {
  className: PropTypes.string,
  offset: PropTypes.number, // Ensure PropTypes for 'offset'
};

NotificationsContainer.defaultProps = {
  className: null,
};

export default dynamic(() => Promise.resolve(NotificationsContainer), {
  ssr: false,
});
