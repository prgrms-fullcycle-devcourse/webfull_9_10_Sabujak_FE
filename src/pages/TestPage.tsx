import { Modal, WriteMessageContent, Button } from '../shared/components/ui';

import { useModalStore } from '../shared/store/useModalStore';

export default function TestPage() {
  const { openModal } = useModalStore();
  return (
    <>
      <div className="flex gap-8 p-4">
        {/* 버튼 1: 메세지 입력 모달 */}
        <Button
          onClick={() => openModal('편지 쓰기', <WriteMessageContent />, 'writeMessage')}
        >
          writeMessage
        </Button>

        <Button onClick={() => openModal('제목', <p>내용</p>, 'yes')}>
          yes
        </Button>

        <Button onClick={() => openModal('제목', <p>내용</p>, 'yesno')}>
          yesno
        </Button>
      </div>
      <Modal />
    </>
  )
}

