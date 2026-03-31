import { useEffect, useState } from "react";
import type { CapsuleDetailResponseOneOf } from "../../../../shared/api/generated/model";
import PageLayout from "../../../../shared/components/layout/PageLayout";
import { Button } from "../../../../shared/components/ui";
import { WriteMessageContent } from "../../../message/components/ui/WriteMessageModal";
import { useShare } from "../../hooks";
import "./CapsuleViewUpcoming.css";
import HeartJar from "../../../../shared/components/ui/HeartJar";
import { useModalStore } from "../../../../shared/store/useModalStore";
import { CapsuleEditCheckModal } from "./CapsuleEditCheckModal";
import CapsuleCountdown from "./CapsuleCountdown";
import { connectCapsuleMessageCountStream } from "../../utils/messageCount";
import "./CapsuleViewUpcoming.css";

interface CapsuleViewUpcomingProps {
  room: CapsuleDetailResponseOneOf;
}

export default function CapsuleViewUpcoming({
  room,
}: CapsuleViewUpcomingProps) {
  const { shareUrl, canShare } = useShare();
  const { openModal } = useModalStore();
  const [messageCount, setMessageCount] = useState<number | null>(null);
  // 상세 조회값을 기본으로 쓰고, SSE 이벤트가 오면 그 값을 우선 반영합니다.
  const displayMessageCount = messageCount ?? room.messageCount;

  useEffect(() => {
    // 현재 캡슐의 messageCount 스트림을 구독합니다.
    const cleanup = connectCapsuleMessageCountStream(
      room.slug,
      (nextMessageCount) => {
        setMessageCount(nextMessageCount);
      }
    );

    return () => {
      cleanup();
    };
  }, [room.slug]);

  const handleShare = async () => {
    await shareUrl({
      title: room.title,
      text: "친구들에게 타임캡슐 링크를 공유해보세요.",
      url: window.location.href,
    });
  };

  return (
    <PageLayout
      header={
        <header className="flex items-center justify-between px-6 pt-4">
          <h1 className="text-lg font-bold">{room.title}</h1>
          <button
            type="button"
            aria-label="메뉴"
            className="btn-menu h-10 w-10"
            onClick={() =>
              openModal({
                title: "어드민 체크",
                content: (
                  <CapsuleEditCheckModal
                    slug={room.slug}
                    getRoomName={room.title}
                    getOpenDate={new Date(room.openAt)}
                  />
                ),
                option: "capsuleEditCheckModal",
              })
            }
          />
        </header>
      }
      bottomArea={
        <>
          <Button
            variant="primary"
            onClick={() =>
              openModal({
                title: "편지 쓰기",
                content: <WriteMessageContent slug={room.slug} />,
                option: "writeMessage",
              })
            }
          >
            내 마음 남기기
          </Button>
          <Button
            variant="secondary"
            iconClassName="btn-icon-share"
            onClick={() => void handleShare()}
          >
            {canShare ? "친구들에게 링크 공유하기" : "링크 복사하기"}
          </Button>
        </>
      }
      contentClassName="flex flex-col items-center text-center"
    >
      <div className="room-before">
        <div className="dday-wrap">
          <HeartJar total={displayMessageCount} />

          <div className="mt-10">
            <p className="text-sm font-semibold tracking-[0.24em] text-[#b1b1b1]">
              OPENING SOON
            </p>

            <div className="mt-3">
              <CapsuleCountdown targetDate={room.openAt} />
            </div>
          </div>
        </div>

        <div className="mt-14 w-full rounded-[24px] bg-[#F5F1E9] px-6 py-5 text-lg font-semibold text-[#3a3a3a]">
          현재 <strong>{displayMessageCount}</strong>개의 소중한 마음이 모였어요
        </div>
      </div>
    </PageLayout>
  );
}
