import OpenViewBefore from "../features/capsule/components/ui/OpenViewBefore";
import OpenedView from "../features/capsule/components/ui/OpenView";
import UnavailableView from "../features/capsule/components/UnavailableView";
import { useRoomDetail } from "../features/capsule/hooks";

export default function CapsulePage() {
  const searchParams = new URLSearchParams(window.location.search);
  const slug = searchParams.get("slug") ?? "our-graduation-2025";

  const { data, isLoading, isError } = useRoomDetail(slug);

  if (isLoading) {
    return <div className="p-6 text-center">불러오는 중이에요...</div>;
  }

  if (isError || !data) {
    return <UnavailableView title="방을 찾을 수 없어요. 링크를 다시 확인해주세요." />;
  }

  /* generated 타입은 isOpen만으로는 오픈 후 타입으로 좁혀지지 않아
  messages 필드 유무로 오픈 전/후를 구분*/ 
  if (!("messages" in data)) {
    return <OpenViewBefore room={data} />;
  }

  return <OpenedView room={data} />;
}