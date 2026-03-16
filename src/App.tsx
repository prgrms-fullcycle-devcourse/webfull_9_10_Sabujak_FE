import './App.css'
import { Routes, Route } from 'react-router-dom'
import CreateRoom from "./pages/CreateRoom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>홈</div>} />
      {/* 방만들기 */}
      <Route path="/create-room" element={<CreateRoom />} /> 
    </Routes>
  )
}
