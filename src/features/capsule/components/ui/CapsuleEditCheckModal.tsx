import { useState } from "react";
import { Button, Field, Input } from "../../../../shared/components/ui";
import { useModalStore } from "../../../../shared/store";
import { CapsuleEditModal } from "./CapsuleEditModal";
import { usePostCapsulesSlugVerify } from "../../../../shared/api/generated/capsule/capsule";
import { getErrorMessage } from "../../../../shared/utils/error";
import { verifyPasswordBodySchema } from "../../../../shared/schemas";

type ReloadCapsuleDataResult = {
  title: string;
  openAt: string;
  version: number;
} | null;

interface CapsuleEditCheckModalProps {
  slug: string;
  getCapsuleName?: string;
  getOpenDate?: Date;
  reloadCapsuleData?: () => Promise<ReloadCapsuleDataResult>;
  version?: number;
}

export const CapsuleEditCheckModal = ({
  slug,
  getCapsuleName = "",
  getOpenDate = new Date(),
  reloadCapsuleData,
  version = 0,
}: CapsuleEditCheckModalProps) => {
  const [password, setPassword] = useState("");
  const { openModal, replaceTopModal } = useModalStore();
  const { mutateAsync: verifyMutate } = usePostCapsulesSlugVerify();

  const verifyPassword = verifyPasswordBodySchema.safeParse({ password });
  const passwordErrorMessage = !verifyPassword.success
    ? verifyPassword.error.flatten().fieldErrors.password?.[0]
    : "";
  const fieldPasswordState =
    password.length === 0 ? "" : verifyPassword.success ? "" : "error";
  const fieldPasswordMessage = password.length === 0 ? "" : passwordErrorMessage;

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

    try {
      await verifyMutate({ slug, data: { password } });
      replaceTopModal({
        title: "캡슐 수정",
        content: (
          <CapsuleEditModal
            slug={slug}
            password={password}
            getCapsuleName={getCapsuleName}
            getOpenDate={getOpenDate}
            reloadCapsuleData={reloadCapsuleData}
            getVersion={version}
          />
        ),
        option: "capsuleEditModal",
      });
    } catch (error) {
      openModal({
        title: "비밀번호 체크가 실패했어요",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
    }
  };

  return (
    <div className="flex h-full flex-col items-center p-6">
      <main className="w-full flex flex-1 flex-col items-center pt-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold leading-9 text-zinc-800">
            타임캡슐 권한 확인
          </h1>
          <p className="mt-4 text-base font-medium leading-6 text-neutral-400">
            비밀번호 4자리를 입력해 주세요
          </p>
        </div>

        <div className="w-full pt-16">
          <Field
            id="capsulePassword"
            messageStatus={fieldPasswordState}
            message={fieldPasswordMessage}
          >
            <Input
              type="password"
              iconClassName="icon-lock"
              placeholder="숫자 4자리를 입력해 주세요"
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
