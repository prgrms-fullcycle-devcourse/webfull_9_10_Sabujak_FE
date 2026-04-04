import {
  type InputHTMLAttributes,
  forwardRef,
  type ReactNode,
  useId,
} from "react";
import { handleEnterDown } from "../../utils/EnterEvent";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  status?: "success" | "error";
  rightSlot?: ReactNode;
  inputClassName?: string;
  iconClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    status,
    className,
    inputClassName = "",
    rightSlot,
    iconClassName = "",
    onKeyDown,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;

    const iconWrapperClassName = iconClassName ? `field-icon ${iconClassName}` : "";
    const statusClassName = status ? `is-${status}` : "";
    const wrapperClassName = `field-control ${iconWrapperClassName} ${statusClassName} ${className ?? ""}`.trim();
    const controlClassName = `field-input ${inputClassName}`.trim();
    const handleKeyDown: InputProps["onKeyDown"] = (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      handleEnterDown(e);
    };

    return (
      <div className={wrapperClassName}>
        <input
          ref={ref}
          id={inputId}
          className={controlClassName}
          data-enter-flow="true"
          onKeyDown={handleKeyDown}
          {...props}
        />
        {rightSlot}
      </div>
    );
  }
);

Input.displayName = "Input";
