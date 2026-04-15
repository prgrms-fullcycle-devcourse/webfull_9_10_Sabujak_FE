import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CreateCapsulePage from "./pages/CreateCapsulePage";
import CapsulePage, { LegacyCapsuleRedirectPage } from "./pages/CapsulePage";
import TestPage from "./pages/TestPage";
import Loading from "./shared/components/ui/Loading";
import Modal from "./shared/components/ui/Modal";
import NotFoundPage from "./pages/NotFoundPage";
import { HelmetProvider } from "react-helmet-async";
import { useDimStore } from "./shared/store/useDimStore";
import { Dim } from "./shared/components/ui/Dim";

export default function App() {
  const dimCount = useDimStore((state) => state.useDimCount);
  return (
    <>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* 방만들기 */}
          <Route path="/create-capsule" element={<CreateCapsulePage />} />
          {/* 메세지 오픈 전 */}
          {/* /capsules?slug=... 형태의 기존 공유 링크도 계속 동작하도록 유지 */}
          <Route path="/capsules" element={<LegacyCapsuleRedirectPage />} />
          <Route path="/capsules/:slug" element={<CapsulePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HelmetProvider>
        {dimCount > 0 && <Dim />}
        <Modal />
        <Loading />
    </>
  );
}
