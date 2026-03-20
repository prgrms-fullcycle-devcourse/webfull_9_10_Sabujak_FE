import { Button } from './index';
import { useModalStore } from '../../store/useModalStore';
import { ModalLayout } from '../layout';
// ── Modal (글로벌 모달 렌더러) ──
export default function Modal() {
    const { modals, closeModal } = useModalStore();

    if (modals.length === 0) return null;

    return (
        <>
            {modals.map((modal, index) => {
                // 헤더 구성
                const header = (
                    <>
                        <h2 className="justify-center text-neutral-900 text-lg font-semibold font-['Pretendard'] leading-7">
                            {modal.title}
                        </h2>
                        {(modal.option === 'writeMessage' || modal.option === 'yesno') && (
                            <button
                                onClick={closeModal}
                                className="text-neutral-400 text-xl font-black leading-5"
                            >
                                ✕
                            </button>
                        )}
                    </>
                );

                // 버튼 영역 구성
                let bottomArea = null;

                if (modal.option === 'yes') {
                    bottomArea = (
                        <Button
                            onClick={() => {
                                if (modal.onConfirm) {
                                    modal.onConfirm();
                                } else {
                                    closeModal();
                                }
                            }}
                            className="flex-1"
                        >
                            확인
                        </Button>
                    );
                }

                if (modal.option === 'yesno') {
                    bottomArea = (
                        <>
                            <Button
                                onClick={() => {
                                    if (modal.onConfirm) {
                                        closeModal();
                                        modal.onConfirm();
                                    } else {
                                        closeModal();
                                    }
                                }}
                                className="flex-1"
                            >
                                예
                            </Button>
                            <Button
                                onClick={closeModal}
                                variant="white"
                                className="flex-1 bg-neutral-200"
                            >
                                아니요
                            </Button>
                        </>
                    );
                }

                // 본문 영역: writeMessage는 padding 없음, 나머지는 p-6
                const body = modal.option === 'writeMessage'
                    ? modal.content
                    : <div className="p-6">{modal.content}</div>;

                return (
                    <ModalLayout
                        key={modal.id}
                        header={header}
                        bottomArea={bottomArea}
                        zIndex={9999 + index}
                    >
                        {body}
                    </ModalLayout>
                );
            })}
        </>
    );
}