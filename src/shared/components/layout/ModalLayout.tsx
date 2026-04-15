import type { ReactNode } from "react";
import { Button } from "../ui";
import { motion } from "framer-motion";

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
  full?: "full" | "semi";
}

export default function ModalLayout({
  title,
  onClose,
  showCloseButton = false,
  children,
  primaryButton,
  secondaryButton,
  zIndex = 9999,
  full = "semi",
}: ModalLayoutProps) {
  const isFull = full === "full";

  const variants = {
    initial: { x: "100%", opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 1 },
  };

  const overlayClasses = isFull
    ? "fixed inset-0 overflow-hidden"
    : "fixed inset-0 flex items-center justify-center";

  const modalClasses = isFull
    ? "w-full h-dvh flex flex-col bg-stone-50 overflow-hidden"
    : "w-[85%] max-w-96 bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden";

  const modalTitle = isFull ? "" : title;

  // 공통 레이아웃 (헤더 + 본문 + 버튼)
  const ModalContent = (
    <>
      {(title || showCloseButton) && (
        <div className="flex-none px-6 py-5 border-b border-neutral-100 inline-flex justify-between items-center">
          {title && (
            <h2 className="justify-center text-neutral-900 text-lg font-semibold font-['Pretendard'] leading-7">
              {modalTitle}
            </h2>
          )}
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="btn-close text-neutral-400 text-xl font-black leading-5 h-10 w-10 flex-shrink-0"
              aria-label="닫기"
            ></button>
          )}
        </div>
      )}

      {/* 본문 */}
      <div className="flex-1 h-0 overflow-y-auto text-center whitespace-pre-line">{children}</div>

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
    </>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className={overlayClasses} style={{ zIndex }}>
        {isFull ? (
          <motion.div
            key="full-modal"
            className={modalClasses}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {ModalContent}
          </motion.div>
        ) : (
          <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
            {ModalContent}
          </div>
        )}
      </div>
    </form>
  );
}
