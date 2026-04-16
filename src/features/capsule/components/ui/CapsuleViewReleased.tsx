import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { CapsuleDetailResponseOneOfTwo } from "../../../../shared/api/generated/model";
import PageLayout from "../../../../shared/components/layout/PageLayout";
import { Button } from "../../../../shared/components/ui";
import logoImage from "../../../../../public/logo.png";
import { useShare } from "../../hooks";
import { getColors } from "../../utils/color";
import { formatYearMonth } from "../../utils/date";
import * as htmlToImage from "html-to-image";
import ConfettiCanvas from "../../../../shared/components/ui/ConfettiCanvas";
import CapsuleViewReleasedCountdown from "./CapsuleViewReleasedCountdown";

interface CapsuleViewReleasedProps {
  capsule: CapsuleDetailResponseOneOfTwo;
}

export default function CapsuleViewReleased({ capsule }: CapsuleViewReleasedProps) {
  const navigate = useNavigate();
  const { shareUrl, canShare } = useShare();
  const ref = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    await shareUrl({
      title: capsule.title,
      text: "친구들에게 타임캡슐 주소를 공유해보세요.",
      url: window.location.href,
    });
  };

  const handleCapture = async () => {
    if (!ref.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(ref.current, {
        backgroundColor: "#FDFBF7",
        filter: (node) => !node.classList?.contains("no-capture"),
      });

      const link = document.createElement("a");
      link.download = "capture.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const colors = getColors(capsule.messages.length);
  const expiresAt = new Date(capsule.expiresAt);

  return (
    <div ref={ref}>
      <PageLayout
        header={
          <header className="relative px-6 pt-2.5 pb-2.5 no-capture">
            <button
              type="button"
              aria-label="뒤로가기"
              className="btn-prev absolute h-10 w-10 z-1"
              onClick={() => void navigate(-1)}
            />
            <h1 className="flex justify-center">
              <button
                type="button"
                className="flex justify-center"
                aria-label="메인으로 이동"
                onClick={() => void navigate("/")}
              >
                <img
                  src={logoImage}
                  alt="SABUJAK"
                  aria-hidden="true"
                  className="h-10 w-auto object-contain"
                />
              </button>
            </h1>
          </header>
        }
        bottomArea={
          <>
            <Button
              variant="primary"
              iconClassName="btn-icon-download"
              onClick={() => void handleCapture()}
            >
              이미지로 저장하기
            </Button>
            <Button
              variant="secondary"
              iconClassName="btn-icon-share"
              onClick={() => void handleShare()}
            >
              {canShare ? "친구들에게 주소 공유하기" : "주소 복사하기"}
            </Button>
          </>
        }
        contentClassName="flex flex-col items-center text-center"
      >
        <ConfettiCanvas />
        <section className="w-full released">
          <p className="mt-2 text-center text-[14px] text-gray-400 no-capture">
            드디어 상자가 열렸어요!
          </p>
          <h2
            id="released-capsule-heading"
            className="mt-3 text-center text-[20px] font-extrabold leading-snug text-gray-900"
          >
            {capsule.title}

          </h2>
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3 rounded-xl bg-[#F5EFE6] px-4 py-3 text-gray-800">
              <CapsuleViewReleasedCountdown targetDate={expiresAt} height={20} />
            </div>
          </div>
          <div className="mt-8 text-center text-[12px] text-gray-400">
            {formatYearMonth(expiresAt)} • 소중한 마음들이 도착했어요
          </div>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-4">
            {capsule.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`${colors[index]} flex aspect-square flex-col rounded-3xl p-6 transition-transform active:scale-95`}
              >
                <span className="text-left text-[12px] text-gray-500">
                  {msg.nickname}
                </span>
                <p className="flex flex-1 items-center justify-center break-all whitespace-pre-line text-center text-[16px] font-semibold leading-relaxed text-gray-700">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </PageLayout>
    </div>
  );
}
