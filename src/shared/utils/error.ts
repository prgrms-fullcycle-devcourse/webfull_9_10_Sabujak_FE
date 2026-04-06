import axios from "axios";

const errorMessages = {
  INVALID_INPUT: "요청 값을 확인해 주세요.",
  FORBIDDEN_PASSWORD: "비밀번호가 일치하지 않습니다.",
  CAPSULE_NOT_FOUND : "존재하지 않는 캡슐입니다.",
  SLUG_ALREADY_IN_US: "이미 사용 중인 slug 입니다.",
  SLUG_RESERVATION_MISMATCH: "slug 예약 토큰 검증에 실패했습니다.",
  DUPLICATE_NICKNAME: "중복된 닉네임입니다.",
  CAPSULE_EXPIRED: "만료된 캡슐입니다.",
  CAPSULE_ALREADY_OPENED: "이미 공개된 캡슐입니다.",
  TOO_MANY_REQUESTS: "요청 횟수 제한을 초과했습니다.",
  INTERNAL_SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
} as const;

type ErrorCode = keyof typeof errorMessages;

export const getErrorMessage = (error: unknown): string => {
  let errorMessage = "알 수 없는 오류가 발생했습니다.";
  if (axios.isAxiosError<{ error?: { code?: string } }>(error)) {
    const errorCode = error.response?.data?.error?.code ?? error.code;
    if (errorCode && errorCode in errorMessages) {
      errorMessage = errorMessages[errorCode as ErrorCode];
    } else {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return errorMessage;
};
