import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCapsulesStats } from "../shared/api/generated/capsule/capsule";
import type { CapsuleStatsResponse } from "../shared/api/generated/model/capsuleStatsResponse";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, Field, Input } from "../shared/components/ui";
import {
  buildCapsuleDetailPath,
  extractCapsuleSlug,
} from "../shared/utils/routes";
import logoImage from "../assets/images/common/logo.png";
import MainPageBackground from "./MainPageBackground";
import "./MainPage.css";

const INITIAL_STATS: CapsuleStatsResponse = {
  totalCapsuleCount: 0,
  totalMessageCount: 0,
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isCapsuleStatsResponse = (
  value: unknown
): value is CapsuleStatsResponse => {
  return (
    isRecord(value) &&
    typeof value.totalCapsuleCount === "number" &&
    typeof value.totalMessageCount === "number"
  );
};
import { slugSchema } from "../shared/schemas";
import { useModalStore } from "../shared/store";

export default function MainPage() {
  const navigate = useNavigate();
  const [capsuleInfo, setCapsuleInfo] = useState("");
  const [stats, setStats] = useState<CapsuleStatsResponse>(INITIAL_STATS);
  const { openModal } = useModalStore();

  const verifyCapsuleSlug = slugSchema.safeParse(capsuleInfo);
  const slugError = !verifyCapsuleSlug.success
    ? verifyCapsuleSlug.error.flatten().formErrors[0]
    : "";

  useEffect(() => {
    let cancelled = false;

    const loadInitialStats = async () => {
      try {
        const data = await getCapsulesStats();

        if (!cancelled) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load capsule stats", error);
      }
    };

    void loadInitialStats();

    const apiBaseUrl = import.meta.env.VITE_API_URL ?? window.location.origin;
    const eventSource = new EventSource(
      new URL("/capsules/stats/stream", apiBaseUrl).toString()
    );

    const handleStatsMessage = (event: MessageEvent<string>) => {
      if (cancelled) {
        return;
      }

      try {
        const parsed: unknown = JSON.parse(event.data);

        if (!isCapsuleStatsResponse(parsed)) {
          return;
        }

        setStats(parsed);
      } catch (error) {
        console.error("Failed to parse capsule stats SSE payload", error);
      }
    };

    eventSource.onmessage = handleStatsMessage;
    eventSource.addEventListener(
      "capsuleStats",
      handleStatsMessage as EventListener
    );

    eventSource.onerror = (error) => {
      console.error("capsule stats SSE error", error);
    };

    return () => {
      cancelled = true;
      eventSource.removeEventListener(
        "capsuleStats",
        handleStatsMessage as EventListener
      );
      eventSource.close();
    };
  }, []);

  const totalCapsuleCount = stats.totalCapsuleCount;
  const totalMessageCount = stats.totalMessageCount;

  const slugCheckField =
    capsuleInfo.length === 0 ? "" : verifyCapsuleSlug.success ? "" : "error";

  const slugFieldMessage = capsuleInfo.length === 0 ? "" : slugError;

  const totalCapsuleMessage = (
    <>
      지금까지 <strong>{totalCapsuleCount}</strong>개의 타임캡슐에{" "}<br/>
      <strong>{totalMessageCount}</strong>개의 마음이 모였어요!!
    </>
  );


  const isButtonDisabled = !verifyCapsuleSlug.success;

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapsuleInfo(e.target.value);
  };

  return (
    <PageLayout contentClassName="main-page">
      <MainPageBackground />
      <div className="main-content">
        <h1 className="main-page-brand flex justify-center">
          <img
            src={logoImage}
            alt="SABUJAK"
            className="h-10 w-auto object-contain"
          />
        </h1>

        <h1 className="typing-title mt-2 text-center text-4xl font-bold">
          <span className="typing-line typing-line-delay-1">
            시간이 흐른 뒤 열어보는
          </span>
          <span className="typing-line typing-line-delay-2">우리들의 진심</span>
        </h1>

        <div className="main-page-card-area mt-6">
          <div className="main-page-card-shell">
            <section className="main-page-card rounded-[36px] border border-[#e8dfd2] bg-[#FEFDFC] px-7 py-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
              <p className="text-xl font-bold leading-tight text-[#4a4a4a]">
                마음을 전달할 타임캡슐이 있나요?
              </p>
              <p className="mt-2 text-sm leading-5 text-[#a8a29e]">{totalCapsuleMessage}</p>

              {/* <p className="text-xs leading-6 text-[#a8a29e]">
                전달받은 코드 또는 주소를 입력해 주세요.
              </p> */}

              <div className="mt-6 space-y-2">
                <Field
                  id="roomTitle"
                  message={slugFieldMessage}
                  messageStatus={slugCheckField}
                >
                  <Input
                    placeholder="타임캡슐 코드를 입력해 주세요"
                    value={capsuleInfo}
                    onChange={handleSlugChange}
                    className="h-[20px] rounded-[24px] !border-[#E5E5E5] !bg-white px-6"
                    inputClassName="text-center"
                    rightSlot={
                      <Button
                        variant="sm"
                        enterFlow={true}
                        disabled={isButtonDisabled}
                        onClick={() => {
                          if (!verifyCapsuleSlug.success) {
                            openModal({
                              title: "안내!",
                              content: <p>{slugError}</p>,
                              option: "oneButton",
                            });
                          }

                          const slug = extractCapsuleSlug(capsuleInfo);

                          if (!slug) {
                            return;
                          }

                          void navigate(buildCapsuleDetailPath(capsuleInfo));
                        }}
                      // className="mt-7 min-h-[20px] w-full rounded-[24px] border border-[#efd7c0] bg-[#FDE8D3] px-6 py-5 font-bold text-[#6b5646] shadow-[0_8px_18px_rgba(205,178,152,0.14)] transition-colors hover:bg-[#fae1ca]"
                      >
                        열기
                      </Button>
                    }
                  />




                </Field>



                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="text-sm text-gray-500">♥</span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>


                <Button
                  variant="primary"
                  onClick={() => void navigate("/create-capsule")}
                  className="btn-timecapsule min-h-[20px] w-full rounded-[24px] border border-[#efd7c0] bg-[#ffd4a8] px-6 py-5 font-bold text-[#6b5646]! shadow-[0_8px_18px_rgba(205,178,152,0.14)] transition-colors hover:bg-[#fae1ca]"
                >
                  타임캡슐 만들기
                </Button>
              </div>
            </section>

            <div className="main-page-card-hearts-back" aria-hidden="true">
              <span className="main-page-card-heart main-page-card-heart-top-center main-page-card-heart-red main-page-card-heart-dots" />
              <span className="main-page-card-heart main-page-card-heart-top-right main-page-card-heart-blue main-page-card-heart-lines" />
              <span className="main-page-card-heart main-page-card-heart-bottom-right main-page-card-heart-orange" />
            </div>
            <div className="main-page-card-hearts-front" aria-hidden="true">
              <span className="main-page-card-heart main-page-card-heart-top-left main-page-card-heart-yellow" />
              <span className="main-page-card-heart main-page-card-heart-left-center main-page-card-heart-green main-page-card-heart-dots" />
              <span className="main-page-card-heart main-page-card-heart-bottom-center main-page-card-heart-pink" />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
