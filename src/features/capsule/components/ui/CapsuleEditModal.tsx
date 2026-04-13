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

type ReloadCapsuleDataResult = {
  title: string;
  openAt: string;
  version: number;
} | null;

interface CapsuleEditModalProps {
  slug: string;
  password: string;
  getRoomName: string;
  getOpenDate: Date;
  reloadCapsuleData?: () => Promise<ReloadCapsuleDataResult>;
  getVersion: number;
}

export const CapsuleEditModal = ({
  slug,
  password,
  getRoomName,
  getOpenDate,
  reloadCapsuleData,
  getVersion,
}: CapsuleEditModalProps) => {
  const [openDate, setOpenDate] = useState<Date | null>(getOpenDate);
  const [roomName, setRoomName] = useState<string>(getRoomName);
  const [version, setVersion] = useState<number>(getVersion);
  const navigate = useNavigate();
  const { openModal, clearModals } = useModalStore();
  const { startLoading, stopLoading } = useLoadingStore();

  const verifyCapsuleEdit = updateCapsuleBodySchema.safeParse({
    password,
    title: roomName,
    openAt: openDate?.toISOString(),
    version,
  });

  const fieldErrors = !verifyCapsuleEdit.success
    ? verifyCapsuleEdit.error.flatten().fieldErrors
    : {};

  const {
    password: passwordError = [],
    title: titleError = [],
  } = !verifyCapsuleEdit.success
    ? verifyCapsuleEdit.error.flatten().fieldErrors
    : {};

  const fieldTrue = verifyCapsuleEdit.success ? "" : "error";
  const fieldMessage = titleError[0];
  const isButtonDisabled = !verifyCapsuleEdit.success;

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const CapsuleEdit = async () => {
    if (!verifyCapsuleEdit.success) {
      openModal({
        title: "안내!",
        content: (
          <p style={{ whiteSpace: "pre-wrap" }}>
            {Object.values(fieldErrors).flat().join("\n")}
          </p>
        ),
        option: "oneButton",
      });
      return;
    }

    startLoading();
    try {
      await patchCapsulesSlug(slug, {
        password,
        title: roomName.trim(),
        openAt: openDate?.toISOString() ?? "",
        version,
      });
      stopLoading();
      openModal({
        title: "수정 성공!",
        content: <p>수정 완료되었습니다.</p>,
        option: "oneButton",
        onConfirm: [
          () => {
            window.setTimeout(() => {
              clearModals();
            }, 1);
          },
        ],
      });
    } catch (error) {
      stopLoading();
      openModal({
        title: "수정 실패!",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
    } finally {
      const latest = await reloadCapsuleData?.();

      if (latest) {
        setRoomName(latest.title);
        setOpenDate(new Date(latest.openAt));
        setVersion(latest.version);
      }
    }
  };

  const CapsuleDeleteConfirm = () => {
    openModal({
      title: "정말 삭제할까요",
      content: (
        <p className="text-left">
          삭제하시겠습니까?
          <br />
          삭제 후에는 복구가 불가능합니다.
        </p>
      ),
      option: "twoButton",
      buttonText: ["네", "아니오"],
      onConfirm: [() => CapsuleDelete()],
    });
  };

  const CapsuleDelete = async () => {
    if (!verifyCapsuleEdit.success && passwordError.length > 0) {
      openModal({
        title: "안내!",
        content: <p>{passwordError}</p>,
        option: "oneButton",
      });
      return;
    }

    startLoading();
    try {
      await deleteCapsulesSlug(slug, {
        password,
      });
      stopLoading();
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
      stopLoading();
      openModal({
        title: "삭제 실패",
        content: <p>{getErrorMessage(error)}</p>,
        option: "oneButton",
      });
    }
  };

  return (
    <>
      <div className="flex h-full flex-col items-center bg-stone-50">
        <main className="flex w-full flex-col gap-10 px-6 pt-10 pb-20">
          <div className="flex flex-col gap-2">
            <Field
              id="RoomName"
              label="방 제목"
              message={fieldMessage}
              messageStatus={fieldTrue}
            >
              <Input
                id="RoomName"
                placeholder="방 제목을 입력해 주세요"
                value={roomName}
                maxLength={100}
                onChange={handleRoomNameChange}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <Field
              id="OpenDate"
              label="공개 날짜 (D-Day)"
              helperText="최대 1년 뒤의 날짜까지 설정할 수 있습니다."
            >
              <DatePicker
                id="OpenDate"
                placeholder="날짜를 선택해 주세요"
                value={openDate}
                onChange={(date) => setOpenDate(date)}
              ></DatePicker>
            </Field>
          </div>
        </main>

        <footer className="mt-auto flex w-full flex-col items-center gap-8 px-6 pt-6 pb-12">
          <Button
            enterFlow={true}
            className="w-full rounded-3xl bg-black py-5 font-bold text-white"
            disabled={isButtonDisabled}
            onClick={() => {
              void CapsuleEdit();
            }}
          >
            수정 완료
          </Button>
          <button
            type="button"
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
