import { useState } from "react";
import { Button, Field, Input } from "../../../../shared/components/ui";
import { useModalStore } from "../../../../shared/store";
import { CapsuleEditModal } from "./CapsuleEditModal";
import { postCapsulesSlugVerify } from "../../../../shared/api/generated/capsule/capsule";
import { getErrorMessage } from "../../../../shared/utils/error";
import { PasswordRule } from "../../../../shared/utils/InputValidatedCheck";

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
  const [fieldTrue, setFieldTrue] = useState<"success" | "error" | "">("");
  const [fieldMessage, setFieldMessage] = useState<
    "" | "비밀번호가 부족합니다."
  >("");
  const [buttonEnable, setButtonEnable] = useState(true);
  const { openModal, replaceTopModal } = useModalStore();
  const handleEnterDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && buttonEnable === false) {
      void handleSubmit();
    }
  };

  const PWOnchangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputCheck = PasswordRule(e.target.value);
    setPassword(inputCheck.value);

    if (e.target.value.length === 0) {
      setFieldTrue("");
      setFieldMessage("");
      setButtonEnable(false);
    } else {
      if (inputCheck.boolean) {
        setFieldTrue("success");
        setFieldMessage("");
        setButtonEnable(false);
      } else {
        setFieldTrue("error");
        setFieldMessage("비밀번호가 부족합니다.");
        setButtonEnable(true);
      }
    }
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
              maxLength={4}
              value={password}
              onChange={(e) => {
                PWOnchangeCheck(e);
              }}
              onKeyDown={handleEnterDown}
            />
          </Field>
        </div>
      </main>

      <footer className="mt-auto flex w-full flex-col items-center">
        <Button
        type='submit'
          className="w-full"
          disabled={buttonEnable}
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
