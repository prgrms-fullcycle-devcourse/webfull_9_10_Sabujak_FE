import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePostCapsules,
  usePostCapsulesSlugReservations,
} from "../shared/api/generated/capsule/capsule";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, DatePicker, Field, Input } from "../shared/components/ui";
import { useLoadingStore } from "../shared/store/useLoadingStore";
import { useModalStore } from "../shared/store/useModalStore";
import { getErrorMessage } from "../shared/utils/error";
import { buildCapsuleDetailPath } from "../shared/utils/routes";
import { createCapsuleBodySchema } from "../shared/schemas";

type FieldMessageStatus = "success" | "error" | undefined;

export default function CreateCapsulePage() {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoadingStore();
  const { openModal } = useModalStore();
  const slugReservationMutation = usePostCapsulesSlugReservations();
  const createCapsuleMutation = usePostCapsules();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [openDate, setOpenDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [password, setPassword] = useState("");

  const [reservationToken, setReservationToken] = useState("");
  const [reservedSlug, setReservedSlug] = useState("");
  const [slugMessage, setSlugMessage] = useState("");
  const [slugMessageStatus, setSlugMessageStatus] =
    useState<FieldMessageStatus>(undefined);

  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const verifyCreateCapsule = createCapsuleBodySchema.safeParse({
    slug,
    title,
    openAt: openDate?.toISOString(),
    password,
    reservationToken,
  });

  const fieldErrors = !verifyCreateCapsule.success
    ? verifyCreateCapsule.error.flatten().fieldErrors
    : {};

  const {
    slug: slugError = [],
    title: titleError = [],
    password: passwordError = [],
    // openAt: openAtError = [],
    // reservationToken: tokenError = [],
  } = !verifyCreateCapsule.success
    ? verifyCreateCapsule.error.flatten().fieldErrors
    : {};

  const titleFieldStatus: FieldMessageStatus =
    title.length === 0
      ? undefined
      : titleError.length === 0
      ? undefined
      : "error";
  const slugValidationStatus: FieldMessageStatus =
    slug.length === 0
      ? undefined
      : slugError.length === 0
      ? undefined
      : "error";
  const passwordFieldStatus: FieldMessageStatus =
    password.length === 0
      ? undefined
      : passwordError.length === 0
      ? undefined
      : "error";
  const slugFieldStatus = slugMessageStatus ?? slugValidationStatus;

  const titleFieldMessage = titleError.length === 0 ? "" : titleError[0];
  const slugFieldMessage =
    slugMessage ||
    (slug.length > 0 && slugError.length === 0 ? "" : slugError[0]);
  const passwordFieldMessage = password.length === 0 ? "" : passwordError[0];

  const isButtonDisabled = isCreating || !verifyCreateCapsule.success;

  // alert 대신 공용 modal store를 통해 안내 메시지를 띄운다.
  const openNoticeModal = (message: string, onConfirm?: () => void) => {
    openModal({
      title: "안내",
      content: <p>{message}</p>,
      option: "oneButton",
      buttonText: ["확인"],
      onConfirm: onConfirm ? [onConfirm] : undefined,
    });
  };

  const resetSlugReservation = () => {
    setReservationToken("");
    setReservedSlug("");
    setSlugMessage("");
    setSlugMessageStatus(undefined);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextSlug = e.target.value;
    setSlug(nextSlug);

    if (reservedSlug && reservedSlug !== nextSlug.trim()) {
      resetSlugReservation();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCheckSlug = async () => {
    const trimmedSlug = slug.trim();

    setIsCheckingSlug(true);
    startLoading();

    try {
      // 중복 확인과 동시에 slug 예약 토큰을 발급받아 생성 요청에 사용한다.
      const response = await slugReservationMutation.mutateAsync({
        data: {
          slug: trimmedSlug,
        },
      });

      setReservationToken(response.reservationToken);
      setReservedSlug(response.slug);
      setSlug(response.slug);
      setSlugMessage("사용 가능한 주소입니다.");
      setSlugMessageStatus("success");
    } catch (error) {
      resetSlugReservation();
      setSlugMessage(getErrorMessage(error));
      setSlugMessageStatus("error");
    } finally {
      setIsCheckingSlug(false);
      stopLoading();
    }
  };

  const handleCreateCapsule = async () => {
    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    if (!verifyCreateCapsule.success) {
      openModal({
        title: "안내!",
        content: (
          <p style={{ whiteSpace: "pre-wrap" }}>
            {" "}
            {Object.values(fieldErrors).flat().join("\n")}
          </p>
        ),
        option: "oneButton",
      });
      return;
    }

    setIsCreating(true);
    startLoading();

    try {
      // 중복 확인에서 받은 reservationToken으로 실제 캡슐 생성 요청을 보낸다.
      const response = await createCapsuleMutation.mutateAsync({
        data: {
          slug: trimmedSlug,
          title: trimmedTitle,
          password,
          openAt: openDate?.toISOString() ?? "",
          reservationToken,
        },
      });

      // 생성 성공 후 확인 버튼을 누르면 상세 페이지로 이동한다.
      openNoticeModal("타임캡슐이 생성되었습니다.", () => {
        void navigate(buildCapsuleDetailPath(response.slug));
      });
    } catch (error) {
      openNoticeModal(getErrorMessage(error));
    } finally {
      setIsCreating(false);
      stopLoading();
    }
  };

  return (
    <PageLayout
      bottomArea={
        <Button
          variant="primary"
          enterFlow={true}
          onClick={() => void handleCreateCapsule()}
          disabled={isButtonDisabled}
        >
          {isCreating ? "생성 중..." : "우리의 방 만들기"}
        </Button>
      }
    >
      <h1 className="text-2xl font-bold">타임캡슐 만들기</h1>
      <p className="mt-2 text-sm text-gray-600">
        흩어진 마음들을 모아 미래로 보내요.
        <br />
        우리만의 연결된 공간을 만들어보세요.
      </p>

      <div className="mt-10 space-y-4">
        <Field
          id="roomTitle"
          label="방 제목"
          message={titleFieldMessage}
          messageStatus={titleFieldStatus}
        >
          <Input
            placeholder="방 제목을 입력해 주세요"
            value={title}
            onChange={handleTitleChange}
          />
        </Field>

        <Field
          id="roomUrl"
          label="방 URL 주소"
          helperText="영문 소문자, 숫자, 하이픈(-)만 입력 가능해요."
          message={slugFieldMessage}
          messageStatus={slugFieldStatus}
        >
          <Input
            placeholder="방 주소를 입력해 주세요"
            value={slug}
            rightSlot={
              <Button
                variant="sm"
                onClick={() => void handleCheckSlug()}
                enterFlow={true}
                disabled={isCheckingSlug || !slug.trim()}
              >
                {isCheckingSlug ? "확인 중" : "중복 확인"}
              </Button>
            }
            onChange={handleSlugChange}
          />
        </Field>

        <Field
          id="openDate"
          label="공개 날짜"
          helperText="오늘로부터 최대 1년 뒤까지만 설정할 수 있습니다."
        >
          <DatePicker value={openDate} onChange={setOpenDate} />
        </Field>

        <Field
          id="roomPassword"
          label="관리자 비밀번호"
          helperText="숫자 4자리를 입력해 주세요."
          message={passwordFieldMessage}
          messageStatus={passwordFieldStatus}
        >
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
    </PageLayout>
  );
}
