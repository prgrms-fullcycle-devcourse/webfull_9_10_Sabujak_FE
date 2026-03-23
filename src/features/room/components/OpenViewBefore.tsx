import PageLayout from "../../../shared/components/layout/PageLayout";
import { Button } from "../../../shared/components/ui";
import type { RoomBeforeOpen } from "../types/room";
// import CountdownTimer from "./CountdownTimer";
// import HeartJar from "./HeartJar";

interface OpenViewBeforeProps {
  room: RoomBeforeOpen;
}

export default function OpenViewBefore({ room }: OpenViewBeforeProps) {
  return (
    <PageLayout
      header={(
        <header className="flex items-center justify-between px-6 pt-4">
          <h1 className="text-lg font-bold">{room.title}</h1>
          <button type="button" aria-label="메뉴" className="btn-menu h-10 w-10" />
        </header>
      )}
      bottomArea={(
        <>
          <Button variant="primary">
            내 마음 남기기
          </Button>
          <Button variant="secondary">
            친구들에게 링크 공유하기
          </Button>
        </>
      )}
      contentClassName="flex flex-col items-center text-center"
    >
 
    </PageLayout>
  );
}
