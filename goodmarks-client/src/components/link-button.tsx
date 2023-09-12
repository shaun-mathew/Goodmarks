import { IconContext } from "react-icons";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  icon?: JSX.Element;
  link?: string;
  label?: string;
  className?: string;
  activeClasses?: string;
  iconClassName?: string;
  [key: string]: any;
}

function LinkButton({
  icon,
  link,
  label,
  className,
  activeClasses,
  iconClassName,
  ...otherProps
}: ButtonProps) {
  const defaultClasses =
    "text-gray-400 flex w-10 h-10 hover:bg-gray-200 hover:rounded-lg hover:text-gray-700 justify-center items-center";
  const defaultIconClasses = "text-2xl";
  const defaultActiveClasses = "text-indigo-400";

  const linkClasses = twMerge(`
      ${defaultClasses}
      ${className ?? ""}
    `);

  const linkActiveClasses = twMerge(`
      ${defaultClasses}
      ${className ?? ""}
      ${defaultActiveClasses}
  `);

  const iconClasses = twMerge(`
      ${defaultIconClasses}
      ${iconClassName ?? ""}
  `);

  return (
    <NavLink
      className={({ isActive }) => {
        if (isActive) {
          return linkActiveClasses;
        }

        return linkClasses;
      }}
      to={link || ""}
      {...otherProps}
    >
      {icon && (
        <IconContext.Provider value={{ className: iconClasses }}>
          {icon}
        </IconContext.Provider>
      )}
      {label && <span>{label}</span>}
    </NavLink>
  );
}

export default LinkButton;
