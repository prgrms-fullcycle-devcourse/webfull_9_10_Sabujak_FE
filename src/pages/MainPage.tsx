/*eslint-disable*/
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCapsulesStats } from "../shared/api/generated/capsule/capsule";
import type { CapsuleStatsResponse } from "../shared/api/generated/model/capsuleStatsResponse";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, Field, Input } from "../shared/components/ui";
import { SlugRule } from "../shared/utils/InputValidatedCheck";
import {
  buildCapsuleDetailPath,
  extractCapsuleSlug,
} from "../shared/utils/routes";
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

export default function MainPage() {
  const navigate = useNavigate();
  const [capsuleInfo, setCapsuleInfo] = useState("");
  const [stats, setStats] = useState<CapsuleStatsResponse>(INITIAL_STATS);
  const slugCheck = SlugRule(capsuleInfo);

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
    capsuleInfo.length === 0 ? "" : slugCheck.boolean ? "success" : "error";

  const slugFieldMessage = `지금까지 ${totalCapsuleCount}개의 방에 ${totalMessageCount}개의 마음이 모였어요!!`;

  const isButtonDisabled = !capsuleInfo.trim() || !slugCheck.boolean;

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapsuleInfo(SlugRule(e.target.value).value);
  };

  return (
    <PageLayout
      bottomArea={
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">또는</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <Button
            variant="primary"
            onClick={() => void navigate("/create-capsule")}
            className="mt-6"
          >
            우리들만의 방 만들기
          </Button>
          {/* <p className="mt-2 text-center text-sm text-gray-600">
                        로그인 없이 1분 만에 시작하기
                    </p> */}
        </>
      }
    >
      <MainPageBackground />
      <h3 className="main-page-brand mt-5 text-center text-sm font-semibold tracking-[0.24em] text-[#b1b1b1]">
        SABUJAK
      </h3>
      <h1 className="typing-title mt-11 text-center text-4xl font-bold">
        <span className="typing-line typing-line-delay-1">
          시간이 흐른 뒤 열어보는
        </span>
        <span className="typing-line typing-line-delay-2">우리들의 진심</span>
      </h1>
      <section className="main-page-card mt-21 rounded-[36px] border border-[#e8dfd2] bg-[#FEFDFC] px-7 py-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <p className="text-xl font-bold leading-tight text-[#4a4a4a]">
          이미 참여중인 방이 있나요?
        </p>
        <p className="mt-2 text-base leading-6 text-[#a8a29e]">
          전달받은 방 코드 또는 주소를 입력해 주세요.
        </p>

        <div className="mt-8 space-y-2">
          <Field
            id="roomTitle"
            message={slugFieldMessage}
            messageStatus={slugCheckField}
          >
            <Input
              placeholder="방 코드를 입력해 주세요"
              value={capsuleInfo}
              onChange={(e) => handleSlugChange(e)}
              className="h-[20px] rounded-[24px] !border-[#E5E5E5] !bg-white px-6"
              inputClassName="text-center"
            />
          </Field>
          <Button
            variant="secondary"
            disabled={isButtonDisabled}
            onClick={() => {
              const slug = extractCapsuleSlug(capsuleInfo);

              if (!slug) {
                return;
              }

              // slug와 캡슐 상세 URL 입력을 모두 path 기반 내부 경로로 통일한다.
              void navigate(buildCapsuleDetailPath(capsuleInfo));
            }}
            className="min-h-[20px] w-full rounded-[24px] border border-[#efd7c0] bg-[#FDE8D3] px-6 py-5 font-bold text-[#6b5646] shadow-[0_8px_18px_rgba(205,178,152,0.14)] transition-colors hover:bg-[#fae1ca]"
          >
            방 입장하기
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
