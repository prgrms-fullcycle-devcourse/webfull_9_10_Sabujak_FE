import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { handleEnterDown } from "../../utils/EnterEvent";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: "success" | "error";
  TextareaClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ status, className, TextareaClassName = "", onKeyDown, ...props }, ref) => {
    const generatedId = useId();
    const TextareaId = props.id ?? generatedId;
    const statusClassName = status ? `is-${status}` : "";
    const wrapperClassName = `field-control ${statusClassName} ${
      className ?? ""
    }`.trim();
    const controlClassName =
      `field-input w-full h-full bg-transparent resize-none outline-none ${TextareaClassName}`.trim();
    const handleKeyDown: TextareaProps["onKeyDown"] = (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      handleEnterDown(e);
    };

    return (
      <div className={wrapperClassName}>
        <textarea
          ref={ref}
          id={TextareaId}
          className={`${controlClassName}`}
          data-enter-flow="true"
          onKeyDown={handleKeyDown}
          rows={8}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
