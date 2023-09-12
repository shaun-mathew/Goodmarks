import { IconContext } from "react-icons";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  icon?: JSX.Element;
  onClick?: (...args: any[]) => void;
  label?: string;
  className?: string;
  iconClassName?: string;
  [key: string]: any;
}

function Button({
  icon,
  onClick,
  label,
  className,
  iconClassName,
  ...otherProps
}: ButtonProps) {
  const defaultClasses =
    "text-gray-400 hover:text-gray-600 disabled:text-gray-200";
  const defaultIconClasses = "text-2xl";

  const btnClasses = twMerge(`
      ${defaultClasses}
      ${className ?? ""}
    `);

  const iconClasses = twMerge(`
      ${defaultIconClasses}
      ${iconClassName ?? ""}
  `);

  return (
    <button onClick={onClick} className={btnClasses} {...otherProps}>
      {icon && (
        <span>
          <IconContext.Provider value={{ className: iconClasses }}>
            {icon}
          </IconContext.Provider>
        </span>
      )}

      {label && <span>{label}</span>}
    </button>
  );
}

export default Button;
