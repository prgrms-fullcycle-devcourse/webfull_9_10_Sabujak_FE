import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    id?: string;
    placeholder?: string;
    value?: string;
    onClick?: () => void;
}

const CustomInput = forwardRef<HTMLButtonElement, Props>(
    ({ id, placeholder, value, onClick }, ref) => {
        const hasValue = Boolean(value);
        const datePickerClassName = "field-control field-icon-calendar cursor-pointer";
        const textClassName = hasValue ? "" : "text-gray-400";

        return (
            <button
                id={id}
                ref={ref}
                onClick={onClick}
                className={datePickerClassName}
            >
                <span className={textClassName}>{value || placeholder || "날짜 선택"}</span>
            </button>
        );
    }
);

CustomInput.displayName = "CustomInput";

interface DatePickerProps {
    readonly id?: string;
    readonly value: Date | null;
    readonly onChange: (date: Date | null) => void;
    readonly placeholder?: string;
}

export function DatePicker({ id, value, onChange, placeholder }: DatePickerProps) {
    const now: Date = new Date();
    const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    );
    return (
        <ReactDatePicker
            selected={value}
            onChange={onChange}
            dateFormat="yyyy.MM.dd"
            minDate={tomorrow}
            shouldCloseOnSelect
            placeholderText={placeholder ?? "날짜 선택"}
            popperClassName="z-50"
            wrapperClassName="w-full"
            customInput={<CustomInput id={id} placeholder={placeholder} />}
            className="flex-1 bg-transparent border-none outline-none"
        />
    );
}
