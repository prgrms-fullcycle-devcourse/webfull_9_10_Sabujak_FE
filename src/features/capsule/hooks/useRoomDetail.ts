import { useGetCapsulesSlug } from "../../../shared/api/generated/capsule/capsule";
import type { CapsuleDetailResponse } from "../../../shared/api/generated/model";

type UseRoomDetailResult = {
  data?: CapsuleDetailResponse;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export function useRoomDetail(slug: string): UseRoomDetailResult {
  const { data, isLoading, isError, error } = useGetCapsulesSlug(slug);

  return {
    data,
    isLoading,
    isError,
    error,
  };
}
