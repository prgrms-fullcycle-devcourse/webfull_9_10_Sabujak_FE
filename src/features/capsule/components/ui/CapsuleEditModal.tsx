import {
  deleteCapsulesSlug,
  patchCapsulesSlug,
} from "../../../../shared/api/generated/capsule/capsule";
import {
  Input,
  Button,
  Field,
  DatePicker,
} from "../../../../shared/components/ui";
import { useState } from "react";
import { useModalStore } from "../../../../shared/store";
import { getErrorMessage } from "../../../../shared/utils/error";
import { useNavigate } from "react-router-dom";
import { useLoadingStore } from "../../../../shared/store/useLoadingStore";
import { updateCapsuleBodySchema } from "../../../../shared/schemas";

interface CapsuleEditModalProps {
  slug: string;
  password: string;
  getRoomName: string;
  getOpenDate: Date;
}

export const CapsuleEditModal = ({
  slug,
  password,
  getRoomName,
  getOpenDate,
}: CapsuleEditModalProps) => {
  const [openDate, setOpenDate] = useState<Date | null>(getOpenDate);
  const [roomName, setRoomName] = useState<string>(getRoomName);
  const navigate = useNavigate();
  const { openModal, clearModals } = useModalStore();
  const { startLoading, stopLoading } = useLoadingStore();

  const verifyRoomname = updateCapsuleBodySchema.safeParse({
    password: password,
    title: roomName,
    openAt: openDate?.toISOString(),
  });
  const verifyRoomnameErrorMessage = !verifyRoomname.success
    ? verifyRoomname.error.flatten().fieldErrors.title?.[0]
    : "";

  const fieldTrue = verifyRoomname.success ? "" : "error";
  const fieldMessage = verifyRoomnameErrorMessage;
  const isButtonDisabled = !verifyRoomname.success;

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const CapsuleEdit = async () => {
    startLoading();
    try {
      await patchCapsulesSlug(slug, {
        password,
        title: roomName.trim(),
        openAt: openDate?.toISOString() ?? "",
      });
      openModal({
        title: "수정 성공!",
        content: <p>수정 완료되었습니다.</p>,
        option: "oneButton",
        onConfirm: [
          () => {
            clearModals();
          },
        ],
      });
    } catch (error) {
      openModal({
        title: "수정 실패!",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
    } finally {
      stopLoading();
    }
  };

  const CapsuleDeleteConfirm = () => {
    openModal({
      title: "작성 확인",
      content: (
        <p className="text-left">
          삭제하시겠습니까?
          <br />
          삭제 후에는 복구가 불가능합니다.
        </p>
      ),
      option: "twoButton",
      buttonText: ["예", "아니요"],
      onConfirm: [() => CapsuleDelete()],
    });
  };

  const CapsuleDelete = async () => {
    startLoading();
    try {
      await deleteCapsulesSlug(slug, {
        password,
      });
      openModal({
        title: "삭제 성공!",
        content: <p>삭제가 완료되었습니다.</p>,
        option: "oneButton",
        onConfirm: [
          () => {
            clearModals();
            void navigate("/");
          },
        ],
      });
    } catch (error) {
      openModal({
        title: "삭제 실패",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      {/* 1. 전체를 감싸는 중앙 정렬 컨테이너 추가 */}
      <div className="flex h-full flex-col items-center bg-stone-50">
        {/* 3. Main: absolute 제거, flex-1로 공간 확보 */}
        <main className="w-full px-6 pt-10 pb-20 flex flex-col gap-10">
          {/* 방 제목 섹션 */}
          <div className="flex flex-col gap-2">
            <Field
              id="RoomName"
              label="방 제목"
              message={fieldMessage}
              messageStatus={fieldTrue}
            >
              <Input
                id="RoomName"
                placeholder="방 제목을 입력해주세요"
                value={roomName}
                maxLength={100}
                onChange={handleRoomNameChange}
              />
            </Field>
          </div>

          {/* 공개 날짜 섹션 */}
          <div className="flex flex-col gap-2">
            <Field
              id="OpenDate"
              label="공개 날짜 (D-Day)"
              helperText="최대 1년 뒤의 날짜까지만 설정할 수 있습니다."
            >
              <DatePicker
                id="OpenDate"
                placeholder="날짜를 선택해주세요"
                value={openDate}
                onChange={(date) => setOpenDate(date)}
              ></DatePicker>
            </Field>
          </div>
        </main>

        {/* 4. Footer: 하단 배치 */}
        <footer className="mt-auto flex w-full flex-col items-center gap-8 px-6 pb-12 pt-6">
          <Button
            className="w-full py-5 bg-black rounded-3xl text-white font-bold"
            disabled={isButtonDisabled}
            onClick={() => {
              void CapsuleEdit();
            }}
          >
            수정 완료
          </Button>
          <button
            className="text-neutral-400 text-xs font-medium underline"
            onClick={() => {
              void CapsuleDeleteConfirm();
            }}
          >
            방 삭제하기
          </button>
        </footer>
      </div>
    </>
  );
};
