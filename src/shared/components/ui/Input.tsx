import { type InputHTMLAttributes, forwardRef, type ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    rightSlot?: ReactNode; // input 오른쪽 보조 요소(아이콘, 버튼 등)를 넣을 때 사용
    inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, inputClassName = "", rightSlot, ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;

    /*
    * Input, DatePicker, Textarea 등 공통 스타일 사용
    * .field-control: 공통 필드 스타일
    * .field-error: 에러일 때 빨간 테두리를 적용합니다.
    */
    const wrapperClassName = `field-control ${error ? "field-error" : ""} ${className ?? ""}`.trim();
    const controlClassName = `field-input ${inputClassName}`.trim();

    return (
        <div className={wrapperClassName}>
            <input
                ref={ref}
                id={inputId}
                className={controlClassName}
                {...props}
            />
            {rightSlot}
        </div>
    );
  }
);

Input.displayName = "Input";
