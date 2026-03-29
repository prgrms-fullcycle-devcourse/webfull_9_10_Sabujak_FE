import { useState } from "react";
import { Button, Field, Input } from "../../../../shared/components/ui";
import { useModalStore } from "../../../../shared/store";
import { CapsuleEditModal } from "./CapsuleEditModal";
import { postCapsulesSlugVerify } from "../../../../shared/api/generated/capsule/capsule";
import { getErrorMessage } from "../../../../shared/utils/error";

interface CapsuleEditCheckModalProps {
  slug : string;
  getRoomName?: string;
  getOpenDate?: Date;
}

export const CapsuleEditCheckModal = ({
  slug,
  getRoomName = "",
  getOpenDate = new Date(),
}: CapsuleEditCheckModalProps) => {
  const [password, setPassword] = useState("");
  const { openModal, replaceTopModal } = useModalStore();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setPassword(numericValue);
  };

  const handleSubmit = async () => {
    if (password.length < 4) {
      openModal({
        title: "비밀번호가 부족해요",
        content: <p>비밀번호를 4자리 입력해 주세요.</p>,
        option: "oneButton",
      });
      return;
    }

    try {
      await postCapsulesSlugVerify(slug, {
        password,
      });
      replaceTopModal({
        title: "캡슐 수정",
        content: (
          <CapsuleEditModal
            getRoomName={getRoomName}
            getOpenDate={getOpenDate}
          />
        ),
        option: "capsuleEditModal",
      });
    } catch (error) {
      openModal({
        title: "메세지 전송에 실패했어요!",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
      return;
    }
  };

  return (
    <div className="flex h-full flex-col items-center p-6">
      <main className="flex flex-1 flex-col items-center pt-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold leading-9 text-zinc-800">
            방장 권한 확인
          </h1>
          <p className="mt-4 text-base font-medium leading-6 text-neutral-400">
            비밀번호 4자리를 입력해 주세요.
          </p>
        </div>

        <div className="w-full pt-16">
          <Field id="roomPassword">
            <Input
              type="password"
              iconClassName="icon-lock"
              placeholder="비밀번호 4자리를 입력해 주세요"
              inputMode="numeric"
              maxLength={4}
              value={password}
              onChange={handlePasswordChange}
            />
          </Field>
        </div>
      </main>

      <footer className="mt-auto flex w-full max-w-md flex-col items-center gap-8 px-6 pb-12 pt-6">
        <Button className="w-full" onClick={void handleSubmit}>
          확인
        </Button>
      </footer>
    </div>
  );
};
