import PageLayout from "../../../shared/components/layout/PageLayout";
import { Button } from "../../../shared/components/ui";
import type { CapsuleDetailResponseOneOf } from "../../../shared/api/generated/model";
import { useShare } from "../hooks";
import CountdownTimer from "./CountdownTimer";
import HeartJar from "./HeartJar";
import "./OpenViewBefore.css";

interface OpenViewBeforeProps {
  room: CapsuleDetailResponseOneOf;
}

export default function OpenViewBefore({ room }: OpenViewBeforeProps) {
  const { shareUrl } = useShare();

  const handleShare = async () => {
    await shareUrl({
      title: room.title,
      text: "친구들에게 타임캡슐 링크를 공유해보세요.",
      url: window.location.href,
    });
  };

  return (
    <PageLayout
      header={(
        <header className="flex items-center justify-between px-6 pt-4">
          <h1 className="text-lg font-bold">{room.title}</h1>
          <button type="button" aria-label="메뉴" className="btn-menu h-10 w-10" />
        </header>
      )}
      bottomArea={(
        <>
          <Button variant="primary">
            내 마음 남기기
          </Button>
          <Button variant="secondary" iconClassName="btn-icon-share" onClick={() => void handleShare()}>
            친구들에게 링크 공유하기
          </Button>
        </>
      )}
      contentClassName="flex flex-col items-center text-center"
    >
      <div className="room-before">
        <div className="dday-wrap">
          <HeartJar total={room.messageCount} />

          <div className="mt-10">
            <p className="text-sm font-semibold tracking-[0.24em] text-[#b1b1b1]">
              OPENING SOON
            </p>

            <div className="mt-3">
              <CountdownTimer targetDate={room.openAt} />
            </div>
          </div>
        </div>

        <div className="mt-14 w-full rounded-[24px] bg-[#F5F1E9] px-6 py-5 text-lg font-semibold text-[#3a3a3a]">
          현재 <strong>{room.messageCount}</strong>개의 소중한 마음이 모였어요
        </div>
      </div>
    </PageLayout>
  );
}
