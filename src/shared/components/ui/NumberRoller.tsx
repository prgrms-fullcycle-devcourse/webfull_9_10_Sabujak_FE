import { useEffect, useRef, useState } from "react";

interface DigitProps {
  digit: string;
  height: number;
}


const styles = `
  @keyframes slideOut {
    from { transform: translateY(0); }
    to   { transform: translateY(100%); }
  }
  @keyframes slideIn {
    from { transform: translateY(-100%); }
    to   { transform: translateY(0); }
  }
`;

function Digit({ digit, height }: DigitProps) {
  const prevRef = useRef(digit);
  const [prev, setPrev] = useState<string | null>(null);

  useEffect(() => {
    if (digit !== prevRef.current) {
      setPrev(prevRef.current);
      prevRef.current = digit;
      const timer = setTimeout(() => setPrev(null), 350);
      return () => clearTimeout(timer);
    }
  }, [digit]);

  return (
    <span className="inline-flex overflow-hidden relative" style={{ height }}>
      <style>{styles}</style>

      {/* 이전 숫자: 아래로 사라짐 */}
      {prev !== null && (
        <span
          key={`out-${prev}`}
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: "slideOut 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" }}
        >
          {prev}
        </span>
      )}

      {/* 현재 숫자: 위에서 내려옴 */}
      <span
        key={`in-${digit}`}
        className="flex items-center justify-center w-full"
        style={{
          animation: prev !== null
            ? "slideIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards"
            : "none",
        }}
      >
        {digit}
      </span>
    </span>
  );
}

interface NumberRollerProps {
  value: number;
  padStart?: number;
  className?: string;
  digitClassName?: string;
  height: number;
}

export function NumberRoller({
  value,
  padStart = 0,
  className = "",
  digitClassName = "",
  height,
}: NumberRollerProps) {
  const raw = Math.abs(Math.floor(value)).toString();
  const isNegative = value < 0;

  const padded =
    padStart > 0 && raw.length < padStart ? raw.padStart(padStart, "0") : raw;

  const digits = padded.split("");
  const keyRef = useRef<string[]>([]);

  // 각 자리에 고유 key 부여 (자릿수 변경 시에도 유지)
  // 오른쪽 정렬 기준으로 key 부여
  const maxLen = Math.max(keyRef.current.length, digits.length);
  const newKeys: string[] = [];
  for (let i = 0; i < digits.length; i++) {
    const posFromRight = digits.length - 1 - i;
    newKeys.push(`digit-${posFromRight}`);
  }
  keyRef.current = newKeys;

  return (
    <span
      className={`inline-flex items-center tabular-nums select-none ${className}`}
      style={{ height }}
      aria-label={`${isNegative ? "-" : ""}${value}`}
      role="img"
    >
      {isNegative && (
        <span
          className={`inline-flex items-center justify-center ${digitClassName}`}
          style={{ height, lineHeight: `${height}px` }}
        >
          -
        </span>
      )}
      {digits.map((d, i) => {
        const key = newKeys[i];
        return (
          <span
            key={key}
            className={`inline-flex ${digitClassName}`}
            style={{ height }}
          >
            <Digit digit={d} height={height} />
          </span>
        );
      })}
    </span>
  );
}