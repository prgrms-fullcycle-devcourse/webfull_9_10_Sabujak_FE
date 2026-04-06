import { useRef } from "react";
import type { CapsuleDetailResponseOneOfTwo } from "../../../../shared/api/generated/model";
import PageLayout from "../../../../shared/components/layout/PageLayout";
import { Button } from "../../../../shared/components/ui";
import { useShare } from "../../hooks";
import { getColors } from "../../utils/color";
import { formatYearMonth, formatYearMonthDay, getDiffDays } from "../../utils/date";
import * as htmlToImage from "html-to-image";

interface CapsuleViewReleasedProps {
  room: CapsuleDetailResponseOneOfTwo;
}

export default function CapsuleViewReleased({ room }: CapsuleViewReleasedProps) {
  const { shareUrl, canShare } = useShare();
  const ref = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    await shareUrl({
      title: room.title,
      text: "친구들에게 타임캡슐 링크를 공유해보세요.",
      url: window.location.href,
    });
  };

  const handleCapture = async () => {
    if (!ref.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(ref.current, {
        backgroundColor: "#FDFBF7",
        filter: (node) => {
          return !node.classList?.contains("no-capture");
        }
      });

      const link = document.createElement("a");
      link.download = "capture.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const colors = getColors(room.messages.length);
  const expiresAt = new Date(room.expiresAt);
  return (
    <div ref={ref}>
      <PageLayout
        header={(
          <div className="flex flex-col px-6 py-4">
            <div className="mt-2 text-center text-sm text-gray-400">
              {room.title}
            </div>
            <div className="mt-3 text-center text-2xl font-extrabold leading-snug text-gray-900">
              드디어 상자가<br />
              열렸습니다.
            </div>
            <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3 rounded-xl bg-[#F5EFE6] px-4 py-3 text-gray-800">
              <div
                className="w-4 h-4"
                style={{
                  backgroundImage: "var(--ico-hourglass)", // 아이콘 이름 맞게 변경
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
              />
              <div className="text-sm leading-relaxed">
                이 타임캡슐은 {getDiffDays(new Date(), expiresAt)}일 뒤인 {formatYearMonthDay(expiresAt)}에 영구히 사라집니다.
              </div>
            </div>
            </div>
              {/* 5. 하단 설명 (중앙 + 회색 + 가운데 점) */}
            <div className="mt-8 text-center text-xs text-gray-400">
              {formatYearMonth(expiresAt)} • 소중한 마음들이 도착했어요
            </div>
          </div>
          
        )}
        bottomArea={(
          <>
            <Button variant="primary" iconClassName="btn-icon-download" onClick={() => void handleCapture()}>
              이미지로 저장하기
            </Button>
            <Button variant="secondary" onClick={() => void handleShare()}>
              {canShare ? "친구들에게 링크 공유하기" : "링크 복사하기"}
            </Button>
          </>
        )}
        contentClassName="flex flex-col items-center text-center"
      >
        
        <main className="max-w-md grid grid-cols-2 gap-4">
          {room.messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`${colors[index]} aspect-square rounded-3xl p-6 flex flex-col transition-transform active:scale-95`}
            >
              <span className="text-xs text-gray-500 text-left">
                {msg.nickname}
              </span>
              <p className="whitespace-pre-line leading-relaxed font-semibold text-gray-700 break-keep flex-1 flex items-center justify-center text-center">
                {msg.content}
              </p>
            </div>
          ))}
        </main>
      </PageLayout>
    </div>
  );
}