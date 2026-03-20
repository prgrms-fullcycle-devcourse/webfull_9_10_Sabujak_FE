import { useState } from 'react';
import { useModalStore } from '../shared/store/useModalStore';
import { Button, Input, Textarea, Field } from '../shared/components/ui/index';
import { default as ModalLayout } from '../shared/components/layout/ModalLayout';

export const WriteMessageContent = () => {
    const { openModal, clearModals, closeModal } = useModalStore();
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
        <ModalLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-neutral-900 text-lg font-semibold font-['Pretendard'] leading-7">
                        편지 쓰기
                    </h2>
                    <button
                        onClick={() => closeModal()}
                        className="text-neutral-400 text-xl font-black leading-5 ml-auto"
                    >
                        ✕
                    </button>
                </div>
            }
            bottomArea={
                <Button
                    onClick={handleComplete}
                    className="w-full"
                >
                    작성 완료
                </Button>
            }
        >
            <div className="w-full p-6 flex flex-col justify-start items-start gap-6">
                {/* 닉네임 입력 */}
                <div className="self-stretch h-16 relative">
                    <label htmlFor="nickname" className="w-8 h-4 left-[4px] top-0 absolute justify-center text-neutral-500 text-xs font-medium font-['Pretendard'] leading-4">닉네임</label>
                    <Input
                        id="nickname"
                        value={nickname}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
                        placeholder="닉네임을 입력해주세요"
                        className="w-72 px-4 py-3.5 left-0 top-[16px] absolute bg-neutral-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-neutral-200 inline-flex justify-center items-start overflow-hidden"
                    />
                </div>

                {/* 편지 내용 입력 */}
                <div className="self-stretch h-64 relative">
                    <Field
                        id="content"
                        label="편지 내용"
                    >
                        <Textarea
                            value={content}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                            placeholder="따뜻한 마음을 전해보세요..."
                        />
                    </Field>
                </div>
            </div>
        </ModalLayout>
    );
};