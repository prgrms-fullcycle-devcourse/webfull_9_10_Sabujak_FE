import { useState } from "react";
import { useModalStore } from "../../../../shared/store/useModalStore";
import {
  Button,
  Input,
  Textarea,
  Field,
} from "../../../../shared/components/ui/index";
import { postCapsulesSlugMessages } from "../../../../shared/api/generated/message/message";
import { getErrorMessage } from "../../../../shared/utils/error";
import { useLoadingStore } from "../../../../shared/store/useLoadingStore";
import {
  ContentRule,
  nickNameRule,
} from "../../../../shared/utils/InputValidatedCheck";

interface WriteMessageModalProps {
  slug: string;
}

export const WriteMessageContent = ({ slug }: WriteMessageModalProps) => {
  const { openModal, clearModals } = useModalStore();
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const { startLoading, stopLoading } = useLoadingStore();
  const textMaxLength = 1000;

  const nicknameCheck = nickNameRule(nickname);
  const contentCheck = ContentRule(content);

  const nicknameFieldTrue =
    nickname.length === 0 ? "" : nicknameCheck.boolean ? "success" : "error";

  const nicknameFieldMessage = `${nickname.length}/20`;

  const contentFieldTrue =
    content.length === 0 ? "" : contentCheck.boolean ? "success" : "error";

  const isButtonDisabled =
    !nickname.trim() ||
    !content.trim() ||
    !nicknameCheck.boolean ||
    !contentCheck.boolean;

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(nickNameRule(e.target.value).value);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(ContentRule(e.target.value).value);
  };
  
  const MessageSend = async () => {
    startLoading();
    try {
      await postCapsulesSlugMessages(slug, {
        nickname: nickname.trim(),
        content: content.trim(),
      });
      openModal({
        title: "작성 완료",
        content: <p>편지가 배송되었습니다.</p>,
        option: "oneButton",
        buttonText: ["확인"],
        onConfirm: [
          () => {
            clearModals();
          },
        ],
      });
    } catch (error) {
      openModal({
        title: "메세지 전송에 실패했어요!",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
      return;
    } finally {
      stopLoading();
    }
  };

  const handleComplete = () => {

    openModal({
      title: "작성 확인",
      content: (
        <p className="text-left">
          작성 완료하셨습니까?
          <br />
          전송 후에는 수정이 불가능합니다.
        </p>
      ),
      option: "twoButton",
      buttonText: ["예", "아니요"],
      onConfirm: [() => MessageSend()],
    });
  };


  return (
    <div className="w-full p-6 flex flex-col justify-start items-start gap-6">
      {/* 닉네임 입력 */}
      <div className="self-stretch relative">
        <Field
          id="nickname"
          label="닉네임"
          message={nicknameFieldMessage}
          messageStatus={nicknameFieldTrue}
        >
          <Input
            id="nickname"
            value={nickname}
            maxLength={20}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력해주세요"
          />
        </Field>
      </div>

      {/* 편지 내용 입력 */}
      <div className="self-stretch relative">
        <Field
          id="content"
          label="편지 내용"
          helperText="한 번 남긴 마음은 수정이나 삭제가 불가능해요."
          message=""
          messageStatus={contentFieldTrue}
        >
          <div onClick={() => document.getElementById("content")?.focus()}>
            <div className="releative">
              <Textarea
                id="content"
                value={content}
                maxLength={textMaxLength}
                onChange={handleContentChange}
                placeholder="따뜻한 마음을 전해보세요..."
              />
              <p
                className={`absolute right-0 text-right text-sm text-gray-500 mt-1 ${
                  content.length > textMaxLength ? "text-red-500" : ""
                }`}
              >
                {content.length}/1000
              </p>
            </div>
          </div>
        </Field>
      </div>

      {/* 입력 완료 버튼 */}
      <div className="self-stretch pt-2 pb-2">
        <Button
          onClick={handleComplete}
          className="w-full"
          disabled={isButtonDisabled}
        >
          작성 완료
        </Button>
      </div>
    </div>
  );
};
