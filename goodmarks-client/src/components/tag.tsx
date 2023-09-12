import { twMerge } from "tailwind-merge";
import Button from "./button";

interface TagProps {
  label: string;
  icon?: JSX.Element;
  className?: string;
  iconClassName?: string;
  onTagClick?: (...args: any[]) => void;
  onBtnClick?: (...args: any[]) => void;
}

function Tag({
  label,
  icon,
  className,
  iconClassName,
  onTagClick,
  onBtnClick,
}: TagProps) {
  const defaultClasses =
    "flex text-gray-100 bg-indigo-400 text-[0.65rem] rounded-md px-1 h-4 items-center justify-center";
  const defaultIconClasses = "text-[0.65rem] text-gray-100";

  const classes = twMerge(`
      ${defaultClasses}
      ${className ?? ""}
    `);

  const iconClasses = twMerge(`
      ${defaultIconClasses}
      ${iconClassName ?? ""}
  `);

  return (
    <div className={classes}>
      <Button
        iconClassName={iconClasses}
        className={iconClasses}
        icon={icon}
        onBtnClick={onBtnClick}
      />
      <span onClick={onTagClick}>{label}</span>
    </div>
  );
}

export default Tag;
