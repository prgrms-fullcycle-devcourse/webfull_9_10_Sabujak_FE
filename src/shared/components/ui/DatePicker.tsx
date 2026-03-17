import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendarIcon from "../../../assets/calendar.svg";

interface Props {
    value?: string;
    onClick?: () => void;
}

const CustomInput = forwardRef<HTMLButtonElement, Props>(
    ({ value, onClick }, ref) => {
        return (
            <button
                ref={ref}
                onClick={onClick}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f5f2ed] cursor-pointer"
            >
                <span className="text-gray-700">{value || "날짜 선택"}</span>
                <img src={calendarIcon} className="w-5 h-5 opacity-70" alt="" />
            </button>
        );
    }
);

CustomInput.displayName = "CustomInput";

interface DatePickerProps {
    readonly label?: string;
    readonly value: Date | null;
    readonly onChange: (date: Date | null) => void;
}

export function DatePicker({ label, value, onChange }: DatePickerProps) {
    const now: Date = new Date();
    const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    );
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="texta-sm">
                    {label}
                </label>
            )}
            <ReactDatePicker
                selected={value}
                onChange={onChange}
                dateFormat="yyyy.MM.dd"
                minDate={tomorrow}
                shouldCloseOnSelect
                placeholderText="날짜 선택"
                popperClassName="z-50"
                wrapperClassName="w-full"
                customInput={<CustomInput/>}
                className="flex-1 bg-transparent border-none outline-none"
            />
        </div>
    );
}