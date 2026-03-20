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
            {childWithId && isValidElement(childWithId) && childWithId.type === 'textarea' ? (
                <textarea
                    {...childWithId.props}
                    className="w-full h-60 bg-neutral-50 rounded-xl outline outline-1 outline-neutral-200 p-4 resize-none"
                />
            ) : (
                childWithId
            )}
            {helperText && (
                <p className="text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}
