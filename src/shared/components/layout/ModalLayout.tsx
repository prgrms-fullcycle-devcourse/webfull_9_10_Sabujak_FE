import type { ReactNode } from "react";
import { Button } from "../ui";

interface ModalLayoutProps {
  title?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  children: ReactNode;
  primaryButton?: {
    text: string;
    onClick: () => void;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  zIndex?: number;
  full?: "full" | "semmi";
}

export default function ModalLayout({
  title,
  onClose,
  showCloseButton = false,
  children,
  primaryButton,
  secondaryButton,
  zIndex = 9999,
  full = "semmi",
}: ModalLayoutProps) {
  const isFull = full === "full";

  const overlayClasses = isFull
    ? "fixed inset-0 bg-stone-50 overflow-hidden"
    : "fixed inset-0 flex items-center justify-center bg-black/50";

  const modalClasses = isFull
    ? "w-full h-dvh flex flex-col overflow-hidden"
    : "w-96 bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden";

  const modalTitle = isFull
    ? ""
    : title;

  return (
    <div className={overlayClasses} style={{ zIndex }}>
      <div
        className={modalClasses}
        onClick={(e) => e.stopPropagation()} // 카드 클릭 시 닫히지 않도록
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className={"flex-none px-6 py-5 border-b border-neutral-100 inline-flex justify-between items-center"}>
            {title && (
              <h2 className="justify-center text-neutral-900 text-lg font-semibold font-['Pretendard'] leading-7">
                {modalTitle}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-neutral-400 text-xl font-black leading-5 p-1 w-6 h-6 flex-shrink-0"
                aria-label="닫기"
                style={{
                  backgroundImage: "var(--ico-close)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></button>
            )}
          </div>
        )}

        {/* 본문 */}
        <div className="flex-1 h-0 overflow-y-auto">{children}</div>

        {/* 버튼 영역 */}
        {(primaryButton || secondaryButton) && (
          <div className="self-stretch px-6 pt-2 pb-8 flex justify-end gap-2">
            {primaryButton && (
              <Button onClick={primaryButton.onClick} className="flex-1">
                {primaryButton.text}
              </Button>
            )}
            {secondaryButton && (
              <Button
                onClick={secondaryButton.onClick}
                variant="secondary"
                className="flex-1 bg-neutral-200"
              >
                {secondaryButton.text}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
