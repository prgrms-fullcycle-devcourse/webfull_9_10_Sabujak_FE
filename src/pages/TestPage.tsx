import { Modal, Button } from '../shared/components/ui';
import { WriteMessageContent } from './ModalWriteMessage';
import { AdminCheck } from './AdminCheckPage';
import { AdminPage } from './AdminPage';
import { useModalStore } from '../shared/store/useModalStore';

export default function TestPage() {
  const { openModal } = useModalStore();
  return (
    <>
      <div className="flex gap-8 p-4">
        {/* 버튼 1: 메세지 입력 모달 */}
        <Button
          onClick={() => openModal({
            title: '편지 쓰기',
            content: <WriteMessageContent />,
            option: 'writeMessage'
          })}
        >
          writeMessage
        </Button>

        <Button onClick={() => openModal({
          title: '버튼1개',
          content: <p>내용</p>,
          option: 'oneButton'
        })}>
          oneButton
        </Button>

        <Button onClick={() => openModal({
          title: '버튼2개',
          content: <p>내용</p>,
          option: 'twoButton'
        })}>
          twoButton
        </Button>

        <Button onClick={() => openModal({
          title: '어드민 체크',
          content: <AdminCheck />,
          option: 'adminCheck'
        })}>
          adminCheck
        </Button>

        <Button onClick={() => openModal({
          title: '어드민',
          content: <AdminPage getRoomName="우리의 소중한 기록" getOpenDate={new Date()} />,
          option: 'admin'
        })}>
          admin
        </Button>
      </div>
      <Modal />
    </>
  )
}

