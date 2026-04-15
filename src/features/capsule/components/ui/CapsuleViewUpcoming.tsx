import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CapsuleDetailResponseOneOf } from "../../../../shared/api/generated/model";
import PageLayout from "../../../../shared/components/layout/PageLayout";
import { Button } from "../../../../shared/components/ui";
import { WriteMessageContent } from "../../../message/components/ui/WriteMessageModal";
import { useShare } from "../../hooks";
import "./CapsuleViewUpcoming.css";
import HeartJar from "../../../../shared/components/ui/HeartJar";
import logoImage from "../../../../assets/images/common/logo.png";
import { useModalStore } from "../../../../shared/store/useModalStore";
import { CapsuleEditCheckModal } from "./CapsuleEditCheckModal";
import CapsuleCountdown from "./CapsuleCountdown";
import { connectCapsuleMessageCountStream } from "../../utils/messageCount";
import { useGetCapsulesSlug } from "@/shared/api/generated/capsule/capsule";

type ReloadCapsuleDataResult = {
  title: string;
  openAt: string;
  version: number;
} | null;

interface CapsuleViewUpcomingProps {
  room: CapsuleDetailResponseOneOf;
}

export default function CapsuleViewUpcoming({
  room,
}: CapsuleViewUpcomingProps) {
  const navigate = useNavigate();
  const { shareUrl, canShare } = useShare();
  const { refetch } = useGetCapsulesSlug(room.slug);
  const { openModal } = useModalStore();
  const [title, setTitle] = useState(room.title);
  const [openAt, setOpenAt] = useState(room.openAt);
  const [version, setVersion] = useState(
    "version" in room && typeof room.version === "number" ? room.version : 0
  );
  const [messageCount, setMessageCount] = useState<number | null>(null);
  const displayMessageCount = messageCount ?? room.messageCount;

  useEffect(() => {
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

  const reloadCapsuleData = async (): Promise<ReloadCapsuleDataResult> => {
    const result = await refetch();
    const nextData = result.data;

    if (!nextData) return null;

    setTitle(nextData.title);
    setOpenAt(nextData.openAt);

    const nextVersion =
      "version" in nextData && typeof nextData.version === "number"
        ? nextData.version
        : version;

    setVersion(nextVersion);

    return {
      title: nextData.title,
      openAt: nextData.openAt,
      version: nextVersion,
    };
  };

  const handleShare = async () => {
    await shareUrl({
      title: room.title,
      text: "친구들에게 타임캡슐 주소를 공유해보세요.",
      url: window.location.href,
    });
  };

  return (
    <PageLayout
      header={
        <header className="px-6 pt-5">

          <button
            type="button"
            aria-label="뒤로가기"
            className="btn-prev absolute h-10 w-10 z-1"
            onClick={() => void navigate(-1)}
          />

          <div className="relative flex min-h-10 items-center justify-center">
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

            <button
              type="button"
              aria-label="메뉴"
              className="btn-menu absolute right-0 h-10 w-10"
              onClick={() =>
                openModal({
                  title: "어드민 체크",
                  content: (
                    <CapsuleEditCheckModal
                      slug={room.slug}
                      getRoomName={title}
                      getOpenDate={new Date(openAt)}
                      reloadCapsuleData={reloadCapsuleData}
                      version={version}
                    />
                  ),
                  option: "capsuleEditCheckModal",
                })
              }
            />
          </div>
        </header>
      }
      bottomArea={
        <>
          <Button
            variant="primary"
            onClick={() =>
              openModal({
                title: "메시지 쓰기",
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
            {canShare ? "친구들에게 주소 공유하기" : "주소 복사하기"}
          </Button>
        </>
      }
      contentClassName=""
    >
        <h2 className="text-lg font-bold">{title}</h2>

      <section className="upcoming flex flex-col items-center justify-center text-center">
        <div className="dday-wrap mt-4">
          <HeartJar total={displayMessageCount} />

          <div className="">
            <p className="text-sm font-semibold tracking-[0.24em] text-[#b1b1b1]">
              OPENING SOON
            </p>

            <div className="mt-3">
              <CapsuleCountdown targetDate={openAt} />
            </div>
          </div>
        </div>

        <div className="total-heart mt-14 w-full rounded-[24px] bg-[#F5F1E9] px-6 py-5 text-lg font-semibold text-[#3a3a3a]">
          현재 <strong>{displayMessageCount}</strong>개의 따뜻한 마음이 모였어요
        </div>
      </section>
    </PageLayout>
  );
}
