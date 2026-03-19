import { type InputHTMLAttributes, forwardRef, type ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  rightSlot?: ReactNode;
  inputClassName?: string;
  iconClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, inputClassName = "", rightSlot, iconClassName = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;

    const iconWrapperClassName = iconClassName ? `field-icon ${iconClassName}` : "";
    const wrapperClassName = `field-control ${iconWrapperClassName} ${error ? "field-error" : ""} ${className ?? ""}`.trim();
    const controlClassName = `field-input ${inputClassName}`.trim();

    return (
      <div className={wrapperClassName}>
        <input
          ref={ref}
          id={inputId}
          className={controlClassName}
          {...props}
        />
        {rightSlot}
      </div>
    );
  }
);

Input.displayName = "Input";
