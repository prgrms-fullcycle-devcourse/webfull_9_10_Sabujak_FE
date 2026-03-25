import { Input, Button, Field, DatePicker } from "../shared/components/ui";
import { useState } from "react";

interface AdminPageProps {
    getRoomName: string
    getOpenDate: Date
}

export const AdminPage = (adminPageProps: AdminPageProps) => {
    const [openDate, setOpenDate] = useState<Date | null>(adminPageProps.getOpenDate);
    const [roomName, setRoomName] = useState<string>(adminPageProps.getRoomName);
    return (
        <>
            {/* 1. 전체를 감싸는 중앙 정렬 컨테이너 추가 */}
            <div className="flex h-full flex-col items-center bg-stone-50">

                {/* 3. Main: absolute 제거, flex-1로 공간 확보 */}
                < main className="w-full max-w-md px-6 pt-10 pb-20 flex flex-col gap-10" >
                    {/* 방 제목 섹션 */}
                    < div className="flex flex-col gap-2" >
                        <Field id="RoomName" label="방 제목">
                            <Input
                                id="RoomName"
                                placeholder="방 제목을 입력해주세요"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                        </Field>
                    </div >

                    {/* 공개 날짜 섹션 */}
                    < div className="flex flex-col gap-2" >
                        <Field id="OpenDate" label="공개 날짜 (D-Day)" helperText="최대 1년 뒤의 날짜까지만 설정할 수 있습니다.">
                            <DatePicker id="OpenDate" placeholder="날짜를 선택해주세요" value={openDate} onChange={(date) => setOpenDate(date)}></DatePicker>
                        </Field>
                    </div >
                </main >

                {/* 4. Footer: 하단 배치 */}
                < footer className="w-full max-w-md px-6 pt-6 pb-12 flex flex-col items-center gap-8 mt-auto" >
                    <Button className="w-full py-5 bg-black rounded-3xl text-white font-bold">
                        수정 완료
                    </Button>
                    <button className="text-neutral-400 text-xs font-medium underline">
                        방 삭제하기
                    </button>
                </footer >
            </div >
        </>
    );
};