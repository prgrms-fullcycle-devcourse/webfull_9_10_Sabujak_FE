import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  usePostCapsules,
  usePostCapsulesSlugReservations,
} from "../shared/api/generated/capsule/capsule";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, DatePicker, Field, Input } from "../shared/components/ui";
import { useModalStore } from "../shared/store/useModalStore";
import { getErrorMessage } from "../shared/utils/error";
import { buildCapsuleDetailPath } from "../shared/utils/routes";
import type { ErrorResponse } from "../shared/schemas";
import { createCapsuleBodySchema } from "../shared/schemas";

type FieldMessageStatus = "success" | "error" | undefined;

// slug 하나의 예약 정보 (localStorage에 저장됨)
type SlugReservationEntry = {
  reservationToken: string;
  reservationSessionToken?: string;
  reservedSlug: string;
  reservedUntil: string; // 예약 만료 시각
};

type SlugReservationCache = Record<string, SlugReservationEntry>;

// slug 예약 캐시를 저장하는 localStorage 키
const STORAGE_KEY = "create-capsule-slug-reservations";
// 한 세션에서 중복 확인할 수 있는 slug 최대 개수
const MAX_SLUG_RESERVATIONS_PER_SESSION = 3;

// 만료된 예약을 캐시에서 제거한다
function pruneExpiredReservations(cache: SlugReservationCache): SlugReservationCache {
  const now = Date.now();

  return Object.fromEntries(
    Object.entries(cache).filter(([, entry]) => {
      const reservedUntil = Date.parse(entry.reservedUntil);

      return Number.isFinite(reservedUntil) && reservedUntil > now;
    }),
  );
}

// 브라우저를 다시 열어도 최근 slug 예약을 복원할 수 있도록 localStorage를 읽는다.
function readReservationCache(): SlugReservationCache {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) return {};

    return pruneExpiredReservations(JSON.parse(stored) as SlugReservationCache);
  } catch {
    return {};
  }
}

// 예약 캐시가 바뀔 때마다 localStorage에 동기화한다.
function writeReservationCache(cache: SlugReservationCache) {
  if (Object.keys(cache).length === 0) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  }
}

function getErrorCode(error: unknown) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.error?.code;
  }

  return undefined;
}

export default function CreateCapsulePage() {
  const navigate = useNavigate();
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
  const [reservationSessionToken, setReservationSessionToken] = useState("");
  const [reservedSlug, setReservedSlug] = useState("");
  const [slugMessage, setSlugMessage] = useState("");
  const [slugMessageStatus, setSlugMessageStatus] =
    useState<FieldMessageStatus>(undefined);

  // 이전에 확인한 slug 예약들을 저장해두는 캐시
  const [reservationCache, setReservationCache] = useState<SlugReservationCache>(() =>
    readReservationCache(),
  );

  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const isCheckingSlugRef = useRef(false);
  const isCreatingRef = useRef(false);

  // 캐시가 바뀔 때마다 localStorage에 반영한다.
  useEffect(() => {
    writeReservationCache(reservationCache);
  }, [reservationCache]);

  const verifyCreateCapsule = createCapsuleBodySchema.safeParse({
    slug,
    title,
    openAt: openDate?.toISOString(),
    password,
    reservationToken,
    reservationSessionToken,
  });

  const currentReservation = reservedSlug
    ? pruneExpiredReservations(reservationCache)[reservedSlug]
    : undefined;

  const fieldErrors = !verifyCreateCapsule.success
    ? verifyCreateCapsule.error.flatten().fieldErrors
    : {};

  const {
    slug: slugError = [],
    title: titleError = [],
    password: passwordError = [],
  } = fieldErrors;

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

  const titleFieldMessage = title.length === 0 ? "" : titleError[0];
  const slugFieldMessage =
    slugMessage || ( slug.length === 0 ? "" : slugError[0]);
  const passwordFieldMessage = password.length === 0 ? "" : passwordError[0];

  const isReservationValid =
    !!currentReservation &&
    currentReservation.reservationToken === reservationToken &&
    currentReservation.reservedSlug === reservedSlug &&
    reservedSlug === slug;
  const isButtonDisabled =
    isCreating || isCheckingSlug || !verifyCreateCapsule.success || !isReservationValid;

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

  // slug 예약 관련 상태를 모두 초기화한다.
  const resetSlugReservation = () => {
    setReservationToken("");
    setReservedSlug("");
    setSlugMessage("");
    setSlugMessageStatus(undefined);
  };

  // 같은 세션에서 예약했던 slug들을 캐시에서 제거한다.
  const clearSessionCache = (createdSlug: string) => {
    setReservationCache((prev) => {
      // 세션 토큰이 없으면 생성한 slug만 제거
      if (!reservationSessionToken) {
        const next = { ...prev };
        delete next[createdSlug];
        return next;
      }

      // 세션 토큰이 있으면 같은 세션의 모든 slug 제거
      return Object.fromEntries(
        Object.entries(prev).filter(
          ([, entry]) => entry.reservationSessionToken !== reservationSessionToken,
        ),
      );
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextSlug = e.target.value.replace(/\s+/g, "");
    const nextCache = pruneExpiredReservations(reservationCache);
    const nextReservation = nextSlug ? nextCache[nextSlug] : undefined;
    setReservationCache(nextCache);
    setSlug(nextSlug);

    if (nextReservation) {
      setReservationToken(nextReservation.reservationToken);
      setReservationSessionToken(nextReservation.reservationSessionToken ?? "");
      setReservedSlug(nextReservation.reservedSlug);
      setSlugMessage("사용 가능한 주소입니다.");
      setSlugMessageStatus("success");
      return;
    }

    // 캐시에 없는 slug로 바뀌면 예약 상태를 초기화한다.
    resetSlugReservation();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCheckSlug = async () => {
    if (isCheckingSlugRef.current) return;

    const trimmedSlug = slug.trim();
    const nextCache = pruneExpiredReservations(reservationCache);
    const nextReservationSessionToken = reservationSessionToken;

    setReservationCache(nextCache);

    if (!trimmedSlug || slugError.length > 0) {
      return;
    }

    // 같은 세션에서 이미 3개 예약했으면 더 이상 확인하지 못하게 막는다.
    const sessionReservationCount = Object.values(nextCache).filter(
      (entry) => entry.reservationSessionToken === nextReservationSessionToken,
    ).length;

    if (sessionReservationCount >= MAX_SLUG_RESERVATIONS_PER_SESSION) {
      setSlugMessage("주소는 최대 3개까지만 확인할 수 있습니다.");
      setSlugMessageStatus("error");
      return;
    }

    isCheckingSlugRef.current = true;
    setIsCheckingSlug(true);

    try {
      // 같은 생성 흐름을 이어가기 위해 reservationSessionToken을 함께 보낸다.
      const response = await slugReservationMutation.mutateAsync({
        data: {
          slug: trimmedSlug,
          reservationSessionToken: nextReservationSessionToken || undefined,
        },
      });
      setReservationToken(response.reservationToken);
      setReservationSessionToken(response.reservationSessionToken);
      setReservedSlug(response.slug);
      setSlug(response.slug);
      setSlugMessage("사용 가능한 주소입니다.");
      setSlugMessageStatus("success");
      setReservationCache((prev) => ({
        ...pruneExpiredReservations(prev),
        [response.slug]: {
          reservationToken: response.reservationToken,
          reservationSessionToken: response.reservationSessionToken,
          reservedSlug: response.slug,
          reservedUntil: response.reservedUntil,
        },
      }));
    } catch (error) {
      if (getErrorCode(error) === "SLUG_ALREADY_IN_USE") {
        setReservationCache((prev) => {
          const next = { ...prev };
          delete next[trimmedSlug];
          return next;
        });
      }

      resetSlugReservation();
      setSlugMessage(getErrorMessage(error));
      setSlugMessageStatus("error");
    } finally {
      isCheckingSlugRef.current = false;
      setIsCheckingSlug(false);
    }
  };

  const handleCreateCapsule = async () => {
    if (isCreatingRef.current) return;

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

    if (!isReservationValid) {
      setSlugMessage("슬러그 예약이 만료되었어요. 다시 중복 확인해 주세요.");
      setSlugMessageStatus("error");
      return;
    }

    isCreatingRef.current = true;
    setIsCreating(true);

    try {
      // 중복 확인에서 받은 reservationToken으로 실제 캡슐 생성 요청을 보낸다.
      const response = await createCapsuleMutation.mutateAsync({
        data: {
          slug: trimmedSlug,
          title: trimmedTitle,
          password,
          openAt: openDate?.toISOString() ?? "",
          reservationToken,
          reservationSessionToken: reservationSessionToken || undefined,
        },
      });

      // 방 생성 성공 → 같은 세션에서 선점했던 다른 slug들도 함께 제거한다.
      clearSessionCache(trimmedSlug);
      setReservationSessionToken("");
      resetSlugReservation();

      // 생성 성공 후 확인 버튼을 누르면 상세 페이지로 이동한다.
      openNoticeModal("타임캡슐이 생성되었습니다.", () => {
        void navigate(buildCapsuleDetailPath(response.slug));
      });
    } catch (error) {
      const errorCode = getErrorCode(error);

      if (errorCode === "SLUG_RESERVATION_MISMATCH" || errorCode === "SLUG_ALREADY_IN_USE") {
        // 예약이 깨졌거나 이미 사용 중인 slug면 캐시도 함께 비운다.
        clearSessionCache(trimmedSlug);
        setReservationSessionToken("");
        resetSlugReservation();
        setSlugMessage(
          errorCode === "SLUG_ALREADY_IN_USE"
            ? "이미 사용 중인 주소입니다. 다른 주소를 입력해 주세요."
            : "슬러그 예약이 만료되었어요. 다시 중복 확인해 주세요.",
        );
        setSlugMessageStatus("error");
        return;
      }

      openNoticeModal(getErrorMessage(error));
    } finally {
      isCreatingRef.current = false;
      setIsCreating(false);
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
                className="text-center flex-none"
                onClick={() => void handleCheckSlug()}
                enterFlow={true}
                disabled={isCheckingSlug || !slug.trim() || slugError.length > 0 || isReservationValid}
              >
                {isCheckingSlug ? "확인 중..." : isReservationValid ? "사용 가능" : "중복 확인"}
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
          // helperText="숫자 4자리를 입력해 주세요."
          message={passwordFieldMessage}
          messageStatus={passwordFieldStatus}
        >
          <Input
            type="password"
            iconClassName="icon-lock"
            placeholder="숫자 4자리를 입력해 주세요"
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
