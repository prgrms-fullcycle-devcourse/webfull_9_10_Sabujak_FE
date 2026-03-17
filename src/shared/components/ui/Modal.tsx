import { useState } from 'react';
import ModalLayout from "../layout/ModalLayout";
import { useModalStore } from '../../store/useModalStore';
import Button from './button';



// ── WriteMessageContent (편지 쓰기 폼) ──
const WriteMessageContent = () => {
    const { openModal, clearModals } = useModalStore();
    const [nickname, setNickname] = useState('');
    const [content, setContent] = useState('');

    const handleComplete = () => {
        if (!nickname.trim()) {
            openModal('닉네임이 없어요!', <p>닉네임을 입력해주세요!!!</p>, 'yes');
            return;
        }

        if (!content.trim()) {
            openModal('내용이 없어요!', <p>내용을 입력해 주세요</p>, 'yes');
            return;
        }

        openModal(
            '작성 확인',
            <p className="text-left">작성 완료하셨습니까?<br />전송 후에는 수정이 불가능합니다.</p>,
            'yesno',
            () => {
                console.log('전송 데이터:', { nickname, content });
                openModal('작성 완료', <p>편지가 배송되었습니다.</p>, 'yes', () => {
                    clearModals();
                });
            }
        );
    };

    return (
        <div className="w-full p-6 flex flex-col justify-start items-start gap-6">
            {/* 닉네임 입력 */}
            <div className="self-stretch h-16 relative">
                <div className="w-8 h-4 left-[4px] top-0 absolute justify-center text-neutral-500 text-xs font-medium font-['Pretendard'] leading-4">
                    닉네임
                </div>
                <div className="w-full px-4 py-3.5 left-0 top-[16px] absolute bg-neutral-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-200 inline-flex justify-center items-start overflow-hidden">
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임을 입력해주세요"
                        className="flex-1 bg-transparent outline-none text-sm font-normal font-['Pretendard'] text-black placeholder:text-black/50"
                    />
                </div>
            </div>

            {/* 편지 내용 입력 */}
            <div className="self-stretch h-64 relative">
                <div className="w-11 h-4 left-[4px] top-0 absolute justify-center text-neutral-500 text-xs font-medium font-['Pretendard'] leading-4">
                    편지 내용
                </div>
                <div className="w-full h-60 p-4 left-0 top-[16px] absolute bg-neutral-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 inline-flex justify-center items-start overflow-hidden">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="따뜻한 마음을 전해보세요..."
                        className="flex-1 h-full bg-transparent outline-none resize-none text-sm font-normal font-['Pretendard'] leading-6 text-black placeholder:text-black/50"
                    />
                </div>
            </div>

            {/* 입력 완료 버튼 */}
            <div className="self-stretch pt-2 pb-2">
                <Button
                    onClick={handleComplete}
                    className="w-full"
                >
                    작성 완료
                </Button>
            </div>
        </div>
    );
};

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

// WriteMessageContent를 외부에서 import할 수 있도록 export
export { WriteMessageContent };