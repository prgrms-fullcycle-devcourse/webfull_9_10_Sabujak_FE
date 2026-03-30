import { AnimatePresence, motion } from "framer-motion";
import { useModalStore } from "../../store/useModalStore";
import { ModalLayout } from "../layout";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface ModalWrapperProps {
  children: React.ReactNode;
  zIndex: number;
  isLast: boolean;
  lastModalRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

function ModalWrapper({ children, zIndex, isLast, lastModalRef, onClose }: ModalWrapperProps) {
  return (
    <motion.div
      ref={isLast ? lastModalRef : null}
      tabIndex={-1}
      style={{ zIndex, position: "fixed", inset: 0 }}
      className="outline-none"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      {children}
    </motion.div>
  );
}

// ── Modal (글로벌 모달 관리자) ──
export default function Modal() {
  const { modals, closeModal } = useModalStore();

  const lastModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modals.length > 0) {
      lastModalRef.current?.focus();
    }
  }, [modals.length]);

  return (
    <AnimatePresence mode="popLayout">
      {modals.map((modal, index) => {
        const { id, title, content, option, buttonText, onConfirm } = modal;
        const zIndex = 9999 + index;
        const isLast = index === modals.length - 1;

        const handleClose = () => closeModal(id);

        // 1. 메시지 작성형 모달 (writeMessage)
        if (option === "writeMessage") {
          return (
            <ModalWrapper key={id} zIndex={zIndex} isLast={isLast} lastModalRef={lastModalRef} onClose={handleClose}>
              <ModalLayout
                title={title}
                onClose={handleClose}
                showCloseButton={true}
                zIndex={zIndex}
              >
                {content}
              </ModalLayout>
            </ModalWrapper>
          );
        } else if (
          option === "capsuleEditCheckModal" ||
          option === "capsuleEditModal"
        ) {
          return (
            <ModalWrapper key={id} zIndex={zIndex} isLast={isLast} lastModalRef={lastModalRef} onClose={handleClose}>
              <ModalLayout
                title={title}
                onClose={handleClose}
                showCloseButton={true}
                full="full"
                zIndex={zIndex}
              >
                {content}
              </ModalLayout>
            </ModalWrapper>
          );
        }

        // 2. 버튼형 모달 (oneButton, twoButton)
        // 기본적으로 p-6 패딩을 본문에 추가
        const body = <div className="p-6">{content}</div>;

        // 버튼 상세 설정 (Layout에서 버튼을 그리도록 데이터만 전달)
        const primaryButton = {
          text: buttonText?.[0] || (option === "oneButton" ? "확인" : "예"),
          onClick: () => {
            handleClose();
            if (onConfirm?.[0]) onConfirm[0]();
          },
        };

        const secondaryButton =
          option === "twoButton"
            ? {
              text: buttonText?.[1] || "아니요",
              onClick: () => {
                handleClose();
                if (onConfirm?.[1]) onConfirm[1]();
              },
            }
            : undefined;

        return (
          <ModalWrapper key={id} zIndex={zIndex} isLast={isLast} lastModalRef={lastModalRef} onClose={handleClose}>
            <ModalLayout
              key={id}
              title={title}
              onClose={handleClose}
              primaryButton={primaryButton}
              secondaryButton={secondaryButton}
              zIndex={zIndex}
            >
              {body}
            </ModalLayout>
          </ModalWrapper>
        );
      })}
    </AnimatePresence>
  );
}