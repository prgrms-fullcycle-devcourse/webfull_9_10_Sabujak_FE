import axios from "axios";

const errorMessages = {
  INVALID_INPUT: "입력한 내용을 다시 확인해 주세요.",
  FORBIDDEN_PASSWORD: "비밀번호가 맞지않아요.",
  CAPSULE_NOT_FOUND : "찾으시는 타임캡슐을 찾지 못했어요.",
  SLUG_ALREADY_IN_USE: "누군가 사용중인 타임캡슐이예요.",
  SLUG_RESERVATION_MISMATCH: "확인 시간이 지나 다시 확인이 필요해요.",
  DUPLICATE_NICKNAME: "같은 이름의 작성자 있어요.",
  MESSAGE_LIMIT_EXCEEDED: "타임캡슐에 사랑이 가득차서 메세지를 남길 수 없어요.",
  CAPSULE_EXPIRED: "이미 조용히 닫힌 타임캡슐이예요.",
  CAPSULE_ALREADY_OPENED: "이미 누군가 연 타임캡슐이예요.",
  TOO_MANY_REQUESTS: "요청이 잠시 몰렸어요. 잠시 후 다시 해주세요.",
  INTERNAL_SERVER_ERROR: "고장난 타임캡슐이예요! 다시 시도해주세요.",
  CAPSULE_UPDATE_CONFLICT : "다른 사용자가 먼저 수정했어요.\n최신 정보를 확인한 뒤 다시 저장해 주세요."
} as const;

type ErrorCode = keyof typeof errorMessages;

export const getErrorMessageByCode = (errorCode: ErrorCode): string =>
  errorMessages[errorCode];

export const getErrorMessage = (error: unknown): string => {
  let errorMessage = "앗, 타임캡슐에 잠시 문제가 생겼어요. 다시 시도해 주세요.";
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

