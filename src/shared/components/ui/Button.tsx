import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariantClassNameMap = {
    primary: "bg-[#000000] text-[#ffffff]",
    white: "text-[#000000]",
} as const;

type ButtonProps = {
    variant?: keyof typeof buttonVariantClassNameMap;
    children: ReactNode;
    className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
    variant = "primary",
    children,
    className = "",
    ...props
}: ButtonProps) => {
    const baseClassName = "rounded-2xl py-4";
    const variantClassName = buttonVariantClassNameMap[variant];

    const buttonClassName = `${baseClassName} ${variantClassName} ${className}`.trim();

    return (
        <button className={buttonClassName} {...props}>
            {children}
        </button>
    );
};
