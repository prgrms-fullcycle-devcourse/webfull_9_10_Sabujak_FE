import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: "success" | "error";
  TextareaClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ status, className, TextareaClassName = "", ...props }, ref) => {
    const generatedId = useId();
    const TextareaId = props.id ?? generatedId;
    const statusClassName = status ? `is-${status}` : "";
    const wrapperClassName = `field-control ${statusClassName} ${
      className ?? ""
    }`.trim();
    const controlClassName =
      `field-input w-full h-full bg-transparent resize-none outline-none ${TextareaClassName}`.trim();

    return (
      <div className={wrapperClassName}>
        <textarea
          ref={ref}
          id={TextareaId}
          className={`${controlClassName}`}
          rows={8}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
