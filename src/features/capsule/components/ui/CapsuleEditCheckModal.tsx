import { useState } from "react";
import { Button, Field, Input } from "../../../../shared/components/ui";
import { useModalStore } from "../../../../shared/store";
import { CapsuleEditModal } from "./CapsuleEditModal";
import { postCapsulesSlugVerify } from "../../../../shared/api/generated/capsule/capsule";
import { getErrorMessage } from "../../../../shared/utils/error";
import { useLoadingStore } from "../../../../shared/store/useLoadingStore";
import { verifyPasswordBodySchema } from "../../../../shared/schemas";

interface CapsuleEditCheckModalProps {
  slug: string;
  getRoomName?: string;
  getOpenDate?: Date;
  reloadCapsuleData?: () => Promise<void>;
}

export const CapsuleEditCheckModal = ({
  slug,
  getRoomName = "",
  getOpenDate = new Date(),
  reloadCapsuleData,
}: CapsuleEditCheckModalProps) => {
  const [password, setPassword] = useState("");
  const { openModal, replaceTopModal } = useModalStore();
  const { startLoading, stopLoading } = useLoadingStore();

  const verifyPassword = verifyPasswordBodySchema.safeParse({ password });
  const passwordErrorMessage = !verifyPassword.success
    ? verifyPassword.error.flatten().fieldErrors.password?.[0]
    : "";
  const fieldPasswordState = password.length === 0 ? "" : verifyPassword.success ? "" : "error";
  const fieldPasswordMessage = passwordErrorMessage;

  const isButtonDisabled = !verifyPassword.success;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (!verifyPassword.success) {
      openModal({
        title: "안내!",
        content: <p>{passwordErrorMessage}</p>,
        option: "oneButton",
      });
      return;
    }

    startLoading();
    try {
      await postCapsulesSlugVerify(slug, {
        password,
      });
      stopLoading();
      replaceTopModal({
        title: "캡슐 수정",
        content: (
          <CapsuleEditModal
            slug={slug}
            password={password}
            getRoomName={getRoomName}
            getOpenDate={getOpenDate}
            reloadCapsuleData={reloadCapsuleData}
          />
        ),
        option: "capsuleEditModal",
      });
    } catch (error) {
      stopLoading();
      openModal({
        title: "비밀번호 체크에 실패했어요!",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
      return;
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
            messageStatus={fieldPasswordState}
            message={fieldPasswordMessage}
          >
            <Input
              type="password"
              iconClassName="icon-lock"
              placeholder="비밀번호 4자리를 입력해 주세요"
              inputMode="numeric"
              value={password}
              maxLength={4}
              onChange={handlePasswordChange}
            />
          </Field>
        </div>
      </main>

      <footer className="mt-auto flex w-full flex-col items-center">
        <Button
          type="submit"
          enterFlow={true}
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