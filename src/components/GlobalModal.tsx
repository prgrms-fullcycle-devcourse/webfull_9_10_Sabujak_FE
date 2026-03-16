import { useModalStore } from '../shared/store/useModalStore';

export const GlobalModal = () => {
  const { modals, closeModal } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal, index) => (
        <div
          key={modal.id}
          className="backGround fixed inset-0 flex items-center justify-center bg-black/50"
          style={{ zIndex: 9999 + index }}
        >
          <div className="w-96 bg-white rounded-[32px] shadow-2xl flex flex-col justify-start items-start overflow-hidden">
            {/* 헤더 */}
            <div className="self-stretch px-6 py-5 border-b border-neutral-100 inline-flex justify-between items-center">
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
            </div>

            {/* 본문 */}
            <div className={modal.option === 'writeMessage' ? 'self-stretch' : 'self-stretch p-6'}>
              {modal.content}
            </div>

            {/* 버튼 영역 */}
            <div className="self-stretch px-6 pt-2 pb-8 flex justify-end gap-2">
              {/* 확인 버튼 */}
              {modal.option === 'yes' && (
                <button
                  onClick={() => {
                    if (modal.onConfirm) {
                      modal.onConfirm();
                    } else {
                      closeModal();
                    }
                  }}
                  className="flex-1 h-14 py-4 bg-neutral-900 rounded-2xl text-center text-white text-base font-semibold font-['Pretendard'] leading-6"
                >
                  확인
                </button>
              )}

              {/* 예 / 아니요 버튼 */}
              {modal.option === 'yesno' && (
                <>
                  <button
                    onClick={() => {
                      if (modal.onConfirm) {
                        closeModal();
                        modal.onConfirm();
                      } else {
                        closeModal();
                      }
                    }}
                    className="flex-1 h-14 py-4 bg-neutral-900 rounded-2xl text-center text-white text-base font-semibold font-['Pretendard'] leading-6"
                  >
                    예
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 h-14 py-4 bg-neutral-200 rounded-2xl text-center text-neutral-900 text-base font-semibold font-['Pretendard'] leading-6"
                  >
                    아니요
                  </button>
                </>
              )}

              {/* 편지 쓰기 — 입력 완료 버튼은 WriteMessageContent 안에서 처리 */}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};