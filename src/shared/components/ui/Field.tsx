import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

type FieldChildProps = {
    id?: string;
};

interface FieldProps {
    id?: string;
    label?: string;
    helperText?: string;
    children: ReactElement<FieldChildProps> | ReactNode;
}

export function Field({ id, label, helperText, children }: FieldProps) {
    const childWithId = isValidElement(children)
        ? cloneElement(children as ReactElement<FieldChildProps>, { id })
        : children;

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label htmlFor={id} className="texta-sm">
                    {label}
                </label>
            )}
            {childWithId}
            {helperText && (
                <p className="text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}
