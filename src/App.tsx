import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';
import CreateRoom from "./pages/CreateRoom";
import RoomPage from "./pages/RoomPage";
import TestPage from './pages/TestPage';
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* 방만들기 */}
        <Route path="/create-room" element={<CreateRoom />} />
        {/* 메세지 오픈 전 */}
        <Route path="/room" element={<RoomPage />} />
        <Route path='/test' element={<TestPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );

}
