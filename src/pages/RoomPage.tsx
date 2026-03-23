import OpenViewBefore from "../features/room/components/OpenViewBefore";
import OpenedView from "../features/room/components/OpenView";
import UnavailableView from "../features/room/components/UnavailableView";
import { useRoomDetail } from "../features/room/hooks/useRoomDetail";

export default function RoomPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const slug = searchParams.get("slug") ?? "our-graduation-2025";

  const data = useRoomDetail(slug);

  if (!data) {
    return <UnavailableView title="존재하지 않는 캡슐입니다." />;
  }

  if (!data.isOpen) {
    return <OpenViewBefore room={data} />;
  }

  return <OpenedView room={data} />;
}
