import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

type FieldChildProps = {
    id?: string;
    status?: FieldMessageStatus;
};

type FieldMessageStatus = "success" | "error";

interface FieldProps {
    id?: string;
    label?: string;
    message?: string;
    messageStatus?: FieldMessageStatus;
    helperText?: string;
    children: ReactElement<FieldChildProps> | ReactNode;
}

export function Field({
    id,
    label,
    message,
    messageStatus,
    helperText,
    children,
}: FieldProps) {
    const childWithId = isValidElement(children)
        ? cloneElement(children as ReactElement<FieldChildProps>, {
            id,
            status: messageStatus,
        })
        : children;
    const messageClassName = messageStatus
        ? `field-message field-message-${messageStatus}`
        : "field-message";

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label htmlFor={id} className="text-sm">
                    {label}
                </label>
            )}
            {childWithId}
            {message && (
                <p className={messageClassName}>
                    {message}
                </p>
            )}
            {helperText && (
                <p className="text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}
