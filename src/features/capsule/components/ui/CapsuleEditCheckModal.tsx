import { useState } from "react";
import { Button, Field, Input } from "../../../../shared/components/ui";
import { useModalStore } from "../../../../shared/store";
import { CapsuleEditModal } from "./CapsuleEditModal";
import { postCapsulesSlugVerify } from "../../../../shared/api/generated/capsule/capsule";
import { getErrorMessage } from "../../../../shared/utils/error";
import { PasswordRule } from "../../../../shared/utils/InputValidatedCheck";
import { useLoadingStore } from "../../../../shared/store/useLoadingStore";

interface CapsuleEditCheckModalProps {
  slug: string;
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
  const { startLoading, stopLoading } = useLoadingStore();

  const passwordCheck = PasswordRule(password);
  const fieldTrue =
    password.length === 0 ? "" : passwordCheck.boolean ? "success" : "error";
  const fieldMessage =
    password.length === 0
      ? "숫자만 입력 가능합니다."
      : passwordCheck.boolean
        ? ""
        : "비밀번호가 부족합니다.";
  const isButtonDisabled = !passwordCheck.boolean;

  const handleEnterDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !isButtonDisabled) {
      void handleSubmit();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(PasswordRule(e.target.value).value);
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

    startLoading();
    try {
      await postCapsulesSlugVerify(slug, {
        password,
      });
      replaceTopModal({
        title: "캡슐 수정",
        content: (
          <CapsuleEditModal
            slug={slug}
            password={password}
            getRoomName={getRoomName}
            getOpenDate={getOpenDate}
          />
        ),
        option: "capsuleEditModal",
      });
    } catch (error) {
      openModal({
        title: "비밀번호 체크에 실패했어요!",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
      return;
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex h-full flex-col items-center p-6">
      <main className="w-full flex flex-1 flex-col items-center pt-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold leading-9 text-zinc-800">
            방장 권한 확인
          </h1>
          <p className="mt-4 text-base font-medium leading-6 text-neutral-400">
            비밀번호 4자리를 입력해 주세요.
          </p>
        </div>

        <div className="w-full pt-16">
          <Field
            id="roomPassword"
            messageStatus={fieldTrue}
            message={fieldMessage}
          >
            <Input
              type="password"
              iconClassName="icon-lock"
              placeholder="비밀번호 4자리를 입력해 주세요"
              inputMode="numeric"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleEnterDown}
            />
          </Field>
        </div>
      </main>

      <footer className="mt-auto flex w-full flex-col items-center">
        <Button
          type="submit"
          className="w-full"
          disabled={isButtonDisabled}
          onClick={() => {
            void handleSubmit();
          }}
        >
          확인
        </Button>
      </footer>
    </div>
  );
};
