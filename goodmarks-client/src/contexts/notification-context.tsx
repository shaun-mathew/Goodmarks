import { createContext, useState } from "react";
import Notification from "../components/notification";

export const NotificationContext = createContext({
  addNotification: (_: Notification) => {},
  clearNotifications: () => {},
  setNotifications: (_: Notification[]) => {},
  notifications: [],
});

export type Notification = {
  notificationType: "SUCCESS" | "WARNING" | "ERROR" | "PENDING";
  notificationMessage: string;
  additionalMessages?: string[];
  timeout?: number;
};

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification: Notification) => {
    setNotifications([
      ...notifications,
      { id: notifications.length, ...notification },
    ]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        clearNotifications,
        setNotifications,
        notifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
