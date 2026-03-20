import './App.css'
import { Routes, Route } from 'react-router-dom'
import CreateRoom from "./pages/CreateRoom";
import TestPage from './pages/TestPage';
import MainPage from './pages/MainPage';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* 방만들기 */}
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path='/test' element={<TestPage />} />
      </Routes>
    </>
  )
}

