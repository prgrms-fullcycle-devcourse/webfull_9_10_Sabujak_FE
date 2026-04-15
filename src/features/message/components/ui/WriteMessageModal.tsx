import { useState } from "react";
import { useModalStore } from "../../../../shared/store/useModalStore";
import {
  Button,
  Input,
  Textarea,
  Field,
} from "../../../../shared/components/ui/index";
import { usePostCapsulesSlugMessages } from "../../../../shared/api/generated/message/message";
import { getErrorMessage } from "../../../../shared/utils/error";
import { createMessageBodySchema } from "../../../../shared/schemas";
import "./WriteMessageModal.css";

interface WriteMessageModalProps {
  slug: string;
}

export const WriteMessageContent = ({ slug }: WriteMessageModalProps) => {
  const { openModal, clearModals } = useModalStore();
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const { mutateAsync: sendMessage } = usePostCapsulesSlugMessages();
  const textMaxLength = 1000;

  const verifyWriteMessage = createMessageBodySchema.safeParse({
    nickname,
    content,
  });
  const { nickname: nicknameError = [], content: contentError = [] } =
    !verifyWriteMessage.success
      ? verifyWriteMessage.error.flatten().fieldErrors
      : {};

  const nicknameFieldState =
    nickname.length === 0 ? "" : nicknameError.length <= 0 ? undefined : "error";
  const contentFieldState =
    content.length === 0 ? "" : contentError.length <= 0 ? undefined : "error";

  const nicknameFieldMessage =
    nickname.length === 0
      ? undefined
      : nicknameError.length <= 0
        ? undefined
        : "error";

  const isButtonDisabled = !verifyWriteMessage.success;

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const MessageSend = async () => {
    try {
      await sendMessage({
        slug,
        data: { nickname: nickname.trim(), content: content.trim() },
      });
      openModal({
        title: "메세지 작성 완료",
        content: <p>메세지가 배송되었어요</p>,
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
    }
  };

  const handleComplete = () => {
    openModal({
      title: "작성 확인",
      content: (
        <p className="text-left">
          메세지를 다 작성했나요?
          <br />
          전송 후에는 수정이 안돼요.
        </p>
      ),
      option: "twoButton",
      buttonText: ["예", "아니요"],
      onConfirm: [() => MessageSend()],
    });
  };

  return (
    <div className="letter-content w-full p-6 flex flex-col justify-start items-start gap-6">
      <div className="letter">
        {/* 닉네임 입력 */}
        <div className="self-stretch relative">
          <Field
            id="nickname"
            label="안녕? 나는,"
            message={nicknameFieldMessage}
            messageStatus={nicknameFieldState}
          >
            <Input
              id="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="당신의 이름을 적어주세요"
              maxLength={20}
            />
          </Field>
          <br />
          <p>야.</p>
        </div>

        {/* 편지 내용 입력 */}
        <div className="self-stretch relative">
          <Field
            id="content"
            // label="편지를 써주세요"
            helperText="한 번 남긴 마음은 수정이나 삭제가 불가능해요."
            message=""
            messageStatus={contentFieldState}
          >
            <div onClick={() => document.getElementById("content")?.focus()}>
              <div className="releative">
                <Textarea
                  id="content"
                  value={content}
                  maxLength={textMaxLength}
                  onChange={handleContentChange}
                  placeholder="따뜻한 마음을 전해보세요"
                />
                <p
                  className={`absolute right-0 text-right text-sm text-gray-500 mt-1 ${content.length > textMaxLength ? "text-red-500" : ""
                    }`}
                >
                  {content.length}/1000
                </p>
              </div>
            </div>
          </Field>
        </div>
      </div>

      {/* 입력 완료 버튼 */}
      <div className="self-stretch pt-2 pb-2">
        <Button
          enterFlow={true}
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
