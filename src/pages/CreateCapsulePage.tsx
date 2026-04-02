import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostCapsules, usePostCapsulesSlugReservations} from "../shared/api/generated/capsule/capsule";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, DatePicker, Field, Input } from "../shared/components/ui";
import { useLoadingStore } from "../shared/store/useLoadingStore";
import { useModalStore } from "../shared/store/useModalStore";
import { getErrorMessage } from "../shared/utils/error";
import { PasswordRule, SlugRule, TitleRule} from "../shared/utils/InputValidatedCheck";
import { buildCapsuleDetailPath } from "../shared/utils/routes";

type FieldMessageStatus = "success" | "error" | undefined;

export default function CreateCapsulePage() {
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoadingStore();
  const { openModal } = useModalStore();
  const slugReservationMutation = usePostCapsulesSlugReservations();
  const createCapsuleMutation = usePostCapsules();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [openDate, setOpenDate] = useState<Date | null>(null);
  const [password, setPassword] = useState("");

  const [reservationToken, setReservationToken] = useState("");
  const [reservedSlug, setReservedSlug] = useState("");
  const [slugMessage, setSlugMessage] = useState("");
  const [slugMessageStatus, setSlugMessageStatus] = useState<FieldMessageStatus>(undefined);

  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 전역 validation 유틸을 사용해 각 입력값을 정제하고 유효 여부를 계산한다.
  const titleCheck = TitleRule(title);
  const slugCheck = SlugRule(slug);
  const passwordCheck = PasswordRule(password);

  const titleFieldStatus: FieldMessageStatus =
    title.length === 0 ? undefined : titleCheck.boolean ? "success" : "error";
  const slugValidationStatus: FieldMessageStatus =
    slug.length === 0 ? undefined : slugCheck.boolean ? "success" : "error";
  const passwordFieldStatus: FieldMessageStatus =
    password.length === 0 ? undefined : passwordCheck.boolean ? "success" : "error";

  const titleFieldMessage = `${titleCheck.value.length}/100`;
  const slugFieldMessage = slugMessage || (slug.length > 0 && !slugCheck.boolean ? "영문 소문자, 숫자, 하이픈(-)만 입력할 수 있어요." : `${slugCheck.value.length}/50`);
  const slugFieldStatus = slugMessageStatus ?? slugValidationStatus;
  const passwordFieldMessage = `${password.length}/4`;

  const isButtonDisabled =
    isCreating
    || isCheckingSlug
    || !titleCheck.boolean
    || !slugCheck.boolean
    || !passwordCheck.boolean
    || !openDate
    || !reservationToken
    || reservedSlug !== slugCheck.value.trim();

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
    setTitle(TitleRule(e.target.value).value);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextSlug = SlugRule(e.target.value).value;
    setSlug(nextSlug);

    if (reservedSlug && reservedSlug !== nextSlug.trim()) {
      resetSlugReservation();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(PasswordRule(e.target.value).value);
  };

  const handleCheckSlug = async () => {
    const trimmedSlug = slugCheck.value.trim();

    if (!slugCheck.boolean) {
      setSlugMessage("영문 소문자, 숫자, 하이픈(-)만 입력할 수 있어요.");
      setSlugMessageStatus("error");
      return;
    }

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
    const trimmedTitle = titleCheck.value.trim();
    const trimmedSlug = slugCheck.value.trim();

    if (
      !titleCheck.boolean
      || !slugCheck.boolean
      || !passwordCheck.boolean
      || !openDate
      || !reservationToken
      || reservedSlug !== trimmedSlug
    ) {
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
          openAt: openDate.toISOString(),
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
            rightSlot={(
              <Button
                variant="sm"
                onClick={() => void handleCheckSlug()}
                disabled={isCheckingSlug || !slugCheck.boolean}
              >
                {isCheckingSlug ? "확인 중" : "중복 확인"}
              </Button>
            )}
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
