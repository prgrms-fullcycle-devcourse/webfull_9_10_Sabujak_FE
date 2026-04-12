import { forwardRef, useRef, type KeyboardEventHandler } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./Button";
import { handleEnterDown } from "../../utils/EnterEvent";

interface Props {
  id?: string;
  placeholder?: string;
  value?: string;
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
}

const CustomInput = forwardRef<HTMLButtonElement, Props>(
  ({ id, placeholder, value, onClick, onKeyDown }, ref) => {
    const hasValue = Boolean(value);
    const datePickerClassName = "field-control field-icon icon-calendar";
    const textClassName = hasValue ? "" : "placeholder";
    const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      handleEnterDown(e);
    };

    return (
      <button
        type="button"
        id={id}
        ref={ref}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={datePickerClassName}
        data-enter-flow="true"
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
  readonly onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
}

export function DatePicker({ id, value, onChange, placeholder, onKeyDown }: DatePickerProps) {
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
      customTimeInput={<CustomTimeInput />}
      placeholderText={placeholder ?? "날짜 선택"}
      popperClassName="z-50"
      wrapperClassName="w-full"
      customInput={
        <CustomInput id={id} placeholder={placeholder} onKeyDown={onKeyDown} />
      }
      className="flex-1 bg-transparent border-none outline-none"
    >
      <div className="absolute bottom-1.5 right-2">
        <Button
          variant="sm"
          enterFlow={false}
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

interface TimeInputProps {
  value?: string;
  onChange?: (time: string) => void;
}

function CustomTimeInput({ value, onChange }: TimeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={inputRef}
      type="time"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onClick={() => inputRef.current?.showPicker()}
    />
  );
}