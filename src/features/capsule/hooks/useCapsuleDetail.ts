import { useGetCapsulesSlug } from "../../../shared/api/generated/capsule/capsule";
import type { CapsuleDetailResponse } from "../../../shared/api/generated/model";

type GetCapsulesSlugResult = ReturnType<typeof useGetCapsulesSlug>;

type UseCapsuleDetailResult = {
  data?: CapsuleDetailResponse;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: GetCapsulesSlugResult["refetch"]
};

export function useCapsuleDetail(slug: string): UseCapsuleDetailResult {
  const { data, isLoading, isError, error, refetch } = useGetCapsulesSlug(slug);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
