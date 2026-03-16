import './App.css'
import { Routes, Route } from 'react-router-dom'
import CreateRoom from "./pages/CreateRoom";

import { GlobalModal } from './components/GlobalModal';
import { useModalStore } from './shared/store/useModalStore';
import { WriteMessageContent } from './components/WriteMessageContent.tsx'

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
      <button
        onClick={() => openModal('편지 쓰기', <WriteMessageContent />, 'writeMessage')}
      >
        writeMessage
      </button>

      <button onClick={() => openModal('제목', <p>내용</p>, 'yes')}>
        yes
      </button>

      <button onClick={() => openModal('제목', <p>내용</p>, 'yesno')}>
        yesno
      </button>
    </div>
    <GlobalModal />
  </>
)
}
