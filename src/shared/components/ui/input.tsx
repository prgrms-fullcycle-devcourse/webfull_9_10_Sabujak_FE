import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="texta-sm">
                    {label}
                </label>
            )}
            <input
            ref={ref}
            className={`
                border rounded-md px-3 py-2
                focus:outline-none border-none bg-[#f5f2ed]
                ${error ? "border-red-500" : "border-gray-300"}
                ${className ?? ""}
            `}
            {...props}
            />
        </div>
    );
  }
);

Input.displayName = "Input";