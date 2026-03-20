import './App.css'
import { Routes, Route } from 'react-router-dom'
import CreateRoom from "./pages/CreateRoom";

import { Modal, WriteMessageContent, Button } from './shared/components/ui';

import { useModalStore } from './shared/store/useModalStore';

export default function App() {
  const { openModal } = useModalStore();
  return (
    <>
      <Routes>
        <Route path="/" element={<div>홈</div>} />
        {/* 방만들기 */}
        <Route path="/create-room" element={<CreateRoom />} />
      </Routes>

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

