import { Input, Button } from "../shared/components/ui";
import { useState } from "react";

export const AdminCheck = () => {
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setPassword(numericValue);
  };

  return (
    /* 1. 전체 화면을 Flex 컬럼으로 설정 (스크롤 방지) */
    <div className="flex h-full flex-col p-6">

      {/* 2. 메인 콘텐츠 영역 (flex-1로 남은 공간을 다 차지하게 함) */}
      <main className="flex-1 flex flex-col items-center pt-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-800 leading-9">
            방장 권한 확인
          </h1>
          <p className="mt-4 text-base font-medium text-neutral-400 leading-6">
            안전한 설정을 위해 비밀번호 4자리를 입력해주세요.
          </p>
        </div>

        <div className="w-full pt-16">
          <Input
            type="password"
            iconClassName="icon-lock"
            placeholder="비밀번호 4자리를 입력해주세요"
            inputMode="numeric"
            maxLength={4}
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
      </main>

      <footer className="pb-[env(safe-area-inset-bottom)] pt-4">
        <Button
          className="w-full"
          disabled={password.length < 4}
          onClick={() => {
            console.log("확인", password)
          }}
        >
          확인
        </Button>
      </footer>
    </div>
  );
};