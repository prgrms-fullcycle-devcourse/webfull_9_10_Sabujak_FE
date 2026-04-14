import { Navigate, useParams, useSearchParams } from "react-router-dom";
import CapsuleViewUpcoming from "../features/capsule/components/ui/CapsuleViewUpcoming";
import CapsuleViewReleased from "../features/capsule/components/ui/CapsuleViewReleased";
import { useRoomDetail } from "../features/capsule/hooks";
import { buildCapsuleDetailPath } from "../shared/utils/routes";
import { ErrorPage } from "../shared/components/feedback/ErrorPage";

export function LegacyCapsuleRedirectPage() {
  const [searchParams] = useSearchParams();
  const legacySlug = searchParams.get("slug");

  if (!legacySlug) {
    return <ErrorPage />;
  }

  // 기존 쿼리스트링 링크를 path 기반 상세 URL로 리다이렉트
  return <Navigate to={buildCapsuleDetailPath(legacySlug)} replace />;
}

export default function CapsulePage() {
  const { slug } = useParams<{ slug: string }>();
  const capsuleSlug = slug ?? "";
  const { data, isError } = useRoomDetail(capsuleSlug);

  if (!capsuleSlug || isError || !data) {
    return <ErrorPage />;
  }

  if (!("messages" in data)) {
    return <CapsuleViewUpcoming key={data.slug} room={data} />;
  }

  return <CapsuleViewReleased key={data.slug} room={data} />;
}
