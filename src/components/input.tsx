import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
        <input
          ref={ref}
          className={`
            border rounded-md px-3 py-2
            focus:outline-none border-gray-200 bg-[#f5f5f5]
            ${error ? "border-red-500" : "border-gray-300"}
            ${className ?? ""}
          `}
          {...props}
        />
    );
  }
);

Input.displayName = "Input";