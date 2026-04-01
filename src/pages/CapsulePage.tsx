import { Navigate, useParams, useSearchParams } from "react-router-dom";
import CapsuleViewUpcoming from "../features/capsule/components/ui/CapsuleViewUpcoming";
import CapsuleViewReleased from "../features/capsule/components/ui/CapsuleViewReleased";
import UnavailableView from "../features/capsule/components/UnavailableView";
import { useRoomDetail } from "../features/capsule/hooks";
import { buildCapsuleDetailPath } from "../shared/utils/routes";

export function LegacyCapsuleRedirectPage() {
  const [searchParams] = useSearchParams();
  const legacySlug = searchParams.get("slug");

  if (!legacySlug) {
    return <UnavailableView title="존재하지 않거나 접근할 수 없는 타임캡슐입니다." />;
  }

  // 기존 쿼리스트링 링크를 path 기반 상세 URL로 리다이렉트
  return <Navigate to={buildCapsuleDetailPath(legacySlug)} replace />;
}

export default function CapsulePage() {
  const { slug } = useParams<{ slug: string }>();
  const capsuleSlug = slug ?? "";
  const { data, isLoading, isError } = useRoomDetail(capsuleSlug);

  if (isLoading) {
    return <div className="p-6 text-center">불러오는 중이에요...</div>;
  }

  if (!capsuleSlug || isError || !data) {
    return <UnavailableView title="존재하지 않거나 접근할 수 없는 타임캡슐입니다." />;
  }

  if (!("messages" in data)) {
    return <CapsuleViewUpcoming key={data.slug} room={data} />;
  }

  return <CapsuleViewReleased key={data.slug} room={data} />;
}
