import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface NotificationProps {
  mainMessage: string;
  messages?: string;
  className?: string;
  onUnmount?: () => any;
  [key: string]: any;
}
function Notification({
  mainMessage,
  messages,
  className,
  onUnmount,
  ...otherProps
}: NotificationProps) {
  const defaultClasses =
    "flex flex-col w-80 bg-red-500 text-gray-200 rounded-b-lg px-2 items-center leading-5";

  const notificationClasses = twMerge(`
      ${defaultClasses}
      ${className ?? ""}
    `);

  return (
    <div className={notificationClasses} {...otherProps}>
      {mainMessage}
    </div>
  );
}

export default Notification;
