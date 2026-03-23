import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  TextareaClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, TextareaClassName = "", ...props }, ref) => {
    const generatedId = useId();
    const TextareaId = props.id ?? generatedId;
    const wrapperClassName = `field-control ${error ? "field-error" : ""} ${
      className ?? ""
    }`.trim();
    const controlClassName = `field-input w-full h-full bg-transparent resize-none outline-none ${TextareaClassName}`.trim();

    return (
      <div className={wrapperClassName}>
        <textarea
          ref={ref}
          id={TextareaId}
          className={`${controlClassName}`}
          rows={9}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
