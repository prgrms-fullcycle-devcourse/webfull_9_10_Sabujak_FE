import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariantClassNameMap = {
  primary: "bg-[#000000] text-[#ffffff] p-4",
  secondary: "text-[#000000] p-1.5",
  sm: "w-fit bg-[#000000] text-[#ffffff] p-2.5 text-sm",
} as const;

type ButtonProps = {
  variant?: keyof typeof buttonVariantClassNameMap;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
  enterFlow?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = "primary",
  type = "button",
  children,
  className = "",
  iconClassName,
  enterFlow = false,
  ...props
}: ButtonProps) => {
  const baseClassName = "inline-flex items-center justify-center gap-2 rounded-lg";
  const variantClassName = buttonVariantClassNameMap[variant];

  const buttonClassName = `${baseClassName} ${variantClassName} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClassName}
      data-enter-flow={enterFlow ? "true" : undefined}
      {...props}
    >
      {iconClassName && (
        <span
          className={`btn-icon ${iconClassName}`}
          aria-hidden="true"
        />
      )}
      <span className="btn-text">{children}</span>
    </button>
  );
};
