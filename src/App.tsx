import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';
import CreateCapsulePage from "./pages/CreateCapsulePage";
import CapsulePage from "./pages/CapsulePage";
import TestPage from './pages/TestPage';
import Modal from "./shared/components/ui/Modal";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* 방만들기 */}
        <Route path="/create-room" element={<CreateCapsulePage />} />
        {/* 메세지 오픈 전 */}
        <Route path="/room" element={<CapsulePage />} />
        <Route path='/test' element={<TestPage />} />
      </Routes>
      <Modal />
    </>
  );

}
