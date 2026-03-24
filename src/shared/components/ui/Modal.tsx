import { AnimatePresence } from "framer-motion";
import { useModalStore } from "../../store/useModalStore";
import { ModalLayout } from "../layout";

// ── Modal (글로벌 모달 관리자) ──
export default function Modal() {
  const { modals, closeModal } = useModalStore();

  return (
    <AnimatePresence mode="wait">
      {modals.map((modal, index) => {
        const { id, title, content, option, buttonText, onConfirm } = modal;
        const zIndex = 9999 + index;

        // 1. 메시지 작성형 모달 (writeMessage)
        if (option === "writeMessage") {
          return (
            <ModalLayout
              key={id}
              title={title}
              onClose={closeModal}
              showCloseButton={true}
              zIndex={zIndex}
            >
              {content}
            </ModalLayout>
          );
        } else if (option === "adminCheck" || option === "admin") {
          return (
            <ModalLayout
              key={id}
              title={title}
              onClose={closeModal}
              showCloseButton={true}
              full="full"
            >
              {content}
            </ModalLayout>
          );
        }

        // 2. 버튼형 모달 (oneButton, twoButton)
        // 기본적으로 p-6 패딩을 본문에 추가
        const body = <div className="p-6">{content}</div>;

        // 버튼 상세 설정 (Layout에서 버튼을 그리도록 데이터만 전달)
        const primaryButton = {
          text: buttonText?.[0] || (option === "oneButton" ? "확인" : "예"),
          onClick: () => {
            closeModal();
            if (onConfirm?.[0]) onConfirm[0]();
          },
        };

        const secondaryButton =
          option === "twoButton"
            ? {
              text: buttonText?.[1] || "아니요",
              onClick: () => {
                closeModal();
                if (onConfirm?.[1]) onConfirm[1]();
              },
            }
            : undefined;

        return (
          <ModalLayout
            key={id}
            title={title}
            onClose={closeModal}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
            zIndex={zIndex}
          >
            {body}
          </ModalLayout>
        );
      })}
    </AnimatePresence>
  );
}
