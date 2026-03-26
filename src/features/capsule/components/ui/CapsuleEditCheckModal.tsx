import { Input, Button, Field } from "../../../../shared/components/ui";
import { useState } from "react";
import { useModalStore } from "../../../../shared/store";

export const CapsuleEditCheckModal = () => {
  const [password, setPassword] = useState("");
  const { openModal } = useModalStore();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setPassword(numericValue);
  };

  return (
    /* 1. 전체 화면을 Flex 컬럼으로 설정 (스크롤 방지) */
    <div className="flex h-full flex-col items-center p-6">
      {/* 2. 메인 콘텐츠 영역 (flex-1로 남은 공간을 다 차지하게 함) */}
      <main className="flex-1 flex flex-col items-center pt-12 ">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-800 leading-9">
            방장 권한 확인
          </h1>
          <p className="mt-4 text-base font-medium text-neutral-400 leading-6">
            안전한 설정을 위해 비밀번호 4자리를 입력해주세요.
          </p>
        </div>

        <div className="w-full pt-16">
                  <Field id="roomPassword">
          <Input
            type="password"
            iconClassName="icon-lock"
            placeholder="비밀번호 4자리를 입력해주세요"
            inputMode="numeric"
            maxLength={4}
            value={password}
            onChange={handlePasswordChange}
          />
          </Field>
        </div>
      </main>

      <footer className="w-full max-w-md px-6 pt-6 pb-12 flex flex-col items-center gap-8 mt-auto">
        <Button
          className="w-full"
          onClick={() => {
            if (password.length < 4) {
              return (openModal({
                title: "비밀번호가 부족해요!",
                content: <p>비밀번호를 4자리 입력해 주세요</p>,
                option: "oneButton",
              }));
            }

          }}
        >
          확인
        </Button>
      </footer>
    </div>
  );
};
