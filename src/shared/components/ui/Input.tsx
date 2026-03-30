import {
  type InputHTMLAttributes,
  forwardRef,
  type ReactNode,
  useId,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  status?: "success" | "warning" | "error";
  rightSlot?: ReactNode;
  inputClassName?: string;
  iconClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, status, className, inputClassName = "", rightSlot, iconClassName = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;

    const iconWrapperClassName = iconClassName ? `field-icon ${iconClassName}` : "";
    const statusClassName = status ? `is-${status}` : "";
    const errorClassName = error && !status ? "is-error" : "";
    const wrapperClassName = `field-control ${iconWrapperClassName} ${statusClassName} ${errorClassName} ${className ?? ""}`.trim();
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
