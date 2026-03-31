import axios from "axios";

export const getErrorMessage = (error : unknown) : string => {
let errorMessage = "알 수 없는 오류가 발생했습니다.";
if (axios.isAxiosError<{ error?: { message?: string } }>(error)) {
  errorMessage = error.response?.data?.error?.message ?? error.message;
} else if (error instanceof Error) {
  errorMessage = error.message;
}
return errorMessage
}