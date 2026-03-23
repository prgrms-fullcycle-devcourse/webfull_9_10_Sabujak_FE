import PageLayout from "../../../shared/components/layout/PageLayout";
import { Button } from "../../../shared/components/ui";
import type { RoomOpened } from "../types/room";

interface OpenedViewProps {
  room: RoomOpened;
}

export default function OpenedView({ room }: OpenedViewProps) {
  return (
    <PageLayout
      bottomArea={(
        <>
          <Button variant="primary" iconClassName="btn-icon-download">
            이미지로 저장하기
          </Button>
          <Button variant="secondary">
            친구들에게 링크 공유하기
          </Button>
        </>
      )}
      contentClassName="flex flex-col items-center text-center"
    >
      <div className="mt-10 w-full">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{room.title}</h1>
          <button type="button" aria-label="메뉴" className="btn-menu h-10 w-10" />
        </header>
      </div>

    </PageLayout>
  );
}
