import { twMerge } from "tailwind-merge";
interface InputProps {
  className?: string;
  leftIcon?: JSX.Element;
  leftIconClasses?: string;
  inputClasses?: string;
  isTextArea?: boolean;
  rightIcon?: JSX.Element;
  rightIconClasses?: string;
  [key: string]: any;
}
function Input({
  className,
  leftIcon,
  leftIconClasses,
  inputClasses,
  isTextArea = false,
  rightIcon,
  rightIconClasses,
  ...otherProps
}: InputProps) {
  const defaultStyles =
    "flex items-stretch bg-gray-100 rounded-md border-gray-200 border-2 px-3 text-gray-400 text-xs focus-within:border-indigo-400 gap-2 caret-indigo-400";
  const defaultLeftIconStyles = "flex items-center text-lg";
  const defaultInputStyles = "bg-inherit flex-grow outline-none";
  const defaultRightIconStyles = "flex items-center justify-self-end text-lg";

  const styles = twMerge(`
      ${defaultStyles}
      ${isTextArea ? "flex-grow min-h-8 py-2" : "h-9"}
      ${className ?? ""}
    `);

  const leftIconStyles = twMerge(`
      ${defaultLeftIconStyles}
      ${leftIconClasses ?? ""}
    `);
  const inputStyles = twMerge(`
      ${defaultInputStyles}
      ${isTextArea ? "resize-none" : ""}
      ${inputClasses ?? ""}
    `);
  const rightIconStyles = twMerge(`
      ${defaultRightIconStyles}
      ${rightIconClasses ?? ""}
    `);
  return (
    <div className={styles}>
      {leftIcon && <div className={leftIconStyles}>{leftIcon}</div>}
      {isTextArea ? (
        <textarea className={inputStyles} {...otherProps} />
      ) : (
        <input className={inputStyles} {...otherProps} />
      )}

      {rightIcon && <div className={rightIconStyles}>{rightIcon}</div>}
    </div>
  );
}

export default Input;
