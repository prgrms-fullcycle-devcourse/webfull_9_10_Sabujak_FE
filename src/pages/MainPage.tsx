import { useNavigate } from "react-router-dom";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, Field, Input } from "../shared/components/ui";
import { useState } from "react";
import MainPageBackground from "./MainPageBackground";
import {
  buildCapsuleDetailPath,
  extractCapsuleSlug,
} from "../shared/utils/routes";
import "./MainPage.css";
import { slugSchema } from "../shared/schemas";
import { useModalStore } from "../shared/store";

export default function MainPage() {
  const navigate = useNavigate();
  const [capsuleInfo, setCapsuleInfo] = useState("");
  const { openModal } = useModalStore();

  const verifyCapsuleSlug = slugSchema.safeParse(capsuleInfo);
  const slugError = !verifyCapsuleSlug.success
    ? verifyCapsuleSlug.error.flatten().formErrors[0]
    : "";

  const slugCheckField =
    capsuleInfo.length === 0 ? "" : verifyCapsuleSlug.success ? "" : "error";

  const slugFieldMessage = capsuleInfo.length === 0 ? "" : slugError;

  const isButtonDisabled = !verifyCapsuleSlug.success;

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapsuleInfo(e.target.value);
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
              if (!verifyCapsuleSlug.success) {
                openModal(
                  {
                    title : '안내!',
                    content : <p>{slugError}</p>,
                    option : 'oneButton'
                  }
                );
              }

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
