import { forwardRef, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./Button";

interface Props {
  id?: string;
  placeholder?: string;
  value?: string;
  onClick?: () => void;
}

const CustomInput = forwardRef<HTMLButtonElement, Props>(
  ({ id, placeholder, value, onClick }, ref) => {
    const hasValue = Boolean(value);
    const datePickerClassName = "field-control field-icon icon-calendar";
    const textClassName = hasValue ? "" : "placeholder";

    return (
      <button
        type="button"
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
  const datePickerRef = useRef<ReactDatePicker>(null);
  const now: Date = new Date();
  const minDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const maxDate = new Date(
    now.getFullYear() + 1,
    now.getMonth(),
    now.getDate()
  );
  return (
    <ReactDatePicker
      ref={datePickerRef}
      selected={value}
      onChange={onChange}
      dateFormat="yyyy.MM.dd. HH:mm"
      minDate={minDate}
      maxDate={maxDate}
      shouldCloseOnSelect={false}
      showTimeInput
      placeholderText={placeholder ?? "날짜 선택"}
      popperClassName="z-50"
      wrapperClassName="w-full"
      customInput={<CustomInput id={id} placeholder={placeholder} />}
      className="flex-1 bg-transparent border-none outline-none"
    >
      <div className="absolute bottom-1.5 right-2">
        <Button
          variant="sm"
          onClick={() => {
            datePickerRef.current?.setOpen(false);
          }}
        >
          확인
        </Button>
      </div>
    </ReactDatePicker>
  );
}
