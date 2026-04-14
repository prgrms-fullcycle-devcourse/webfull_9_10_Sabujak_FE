import { useGetCapsulesSlug } from "../../../shared/api/generated/capsule/capsule";
import type { CapsuleDetailResponse } from "../../../shared/api/generated/model";

type GetCapsulesSlugResult = ReturnType<typeof useGetCapsulesSlug>;

type UseRoomDetailResult = {
  data?: CapsuleDetailResponse;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: GetCapsulesSlugResult["refetch"]
};

export function useRoomDetail(slug: string): UseRoomDetailResult {
  const { data, isLoading, isError, error, refetch } = useGetCapsulesSlug(slug);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
