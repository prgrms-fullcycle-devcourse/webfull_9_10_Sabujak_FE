import { Modal, Button } from '../shared/components/ui';
import { WriteMessageContent } from './ModalWriteMessage';

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

        <Button onClick={() => openModal('제목', <p>내용</p>, 'oneButton')}>
          yes
        </Button>

        <Button onClick={() => openModal('제목', <p>내용</p>, 'twoButton')}>
          yesno
        </Button>
      </div>
      <Modal />
    </>
  )
}

