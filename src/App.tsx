import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CreateCapsulePage from "./pages/CreateCapsulePage";
import CapsulePage from "./pages/CapsulePage";
import TestPage from "./pages/TestPage";
import Loading from "./shared/components/ui/Loading";
import Modal from "./shared/components/ui/Modal";
import NotFoundPage from "./pages/NotFoundPage";
import { useLoadingStore } from "./shared/store/useLoadingStore";
import { useDimStore } from "./shared/store/useDimStore";
import { Dim } from "./shared/components/ui/Dim";

export default function App() {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const dimCount = useDimStore((state) => state.useDimCount);
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* 방만들기 */}
        <Route path="/create-capsule" element={<CreateCapsulePage />} />
        {/* 메세지 오픈 전 */}
        <Route path="/capsules" element={<CapsulePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {dimCount > 0 && <Dim />}
      <Modal />
      {isLoading && <Loading />}
    </>
  );
}
