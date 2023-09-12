import { useContext, useEffect, useRef, useState } from "react";
import { NotificationContext } from "../contexts/notification-context";
import NotificationDisplay from "./notification";
import { twMerge } from "tailwind-merge";
import { CSSTransition } from "react-transition-group";

import "../index.css";

function NotificationManager() {
  const { notifications } = useContext(NotificationContext);
  const [currentNotification, setCurrentNotification] = useState(null);
  const nodeRef = useRef(null);
  const [inProp, setInProp] = useState(false);

  const generateClasses = () => {
    if (!currentNotification) {
      return "";
    }

    const { notificationType } = currentNotification;

    let color = "";
    switch (notificationType) {
      case "SUCCESS": {
        color = "bg-green-500";
        break;
      }
      case "WARNING": {
        color = "bg-orange-500";
        break;
      }
      case "ERROR": {
        color = "bg-rose-500";
        break;
      }
      case "PENDING": {
        color = "bg-sky-500";
        break;
      }
      default: {
        color = "";
        break;
      }
    }

    const className = twMerge(
      "flex flex-col w-80 bg-red-500 text-gray-200 rounded-b-lg px-2 items-center leading-5 absolute top-0",
      color
    );

    return className;
  };

  useEffect(() => {
    setCurrentNotification(notifications[notifications.length - 1]);
    setInProp(false);
  }, [notifications]);

  useEffect(() => {
    if (currentNotification) {
      setInProp(true);
    }
  }, [currentNotification]);

  useEffect(() => {
    let timeout = null;
    if (currentNotification?.timeout && inProp) {
      timeout = setTimeout(() => {
        console.log(currentNotification.notificationMessage);
        setInProp(false);
      }, currentNotification.timeout);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [inProp]);

  return (
    <>
      <CSSTransition
        in={inProp}
        nodeRef={nodeRef}
        timeout={3000}
        classNames="notification"
        unmountOnExit
      >
        <div
          key={notifications.length}
          className={generateClasses()}
          ref={nodeRef}
        >
          {currentNotification && currentNotification.notificationMessage}
        </div>
      </CSSTransition>
    </>
  );
}

export default NotificationManager;
