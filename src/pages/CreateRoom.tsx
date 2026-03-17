import PageLayout from "../shared/components/layout/PageLayout";
import Button from "../shared/components/ui/button";

export default function CreateRoom() {
    return (
        <PageLayout
            header={
                <header className="sticky top-0 z-10 bg-[#ffffff] px-6 py-4 flex items-center gap-1.5">
                    <button type="button" aria-label="뒤로가기" className="btn-back w-10 h-10"></button>
                    <h1 className="text-xl font-bold flex-1">방 만들기</h1>
                    <button type="button" aria-label="메뉴" className="btn-menu w-10 h-10"></button>
                </header>
            }
            bottomArea={
                <>
                    <Button variant="primary">
                        롤링페이퍼 방 만들기
                    </Button>
                    <Button variant="white" className="border border-gray-300">
                        방 삭제하기
                    </Button>
                </>
            }
        >
            <h1 className="text-2xl font-bold">타임캡슐 롤링페이퍼</h1>
            <p className="mt-2 text-sm text-gray-600">
                소중한 마음을 담아 미래로 보내는 우리만의 특별한 공간을 만들어보세요.
            </p>

            {/* 인풋 */}
        </PageLayout>
    );
}