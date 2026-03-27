import { useState } from "react";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, DatePicker, Field, Input } from "../shared/components/ui";

export default function CreateCapsulePage() {
  const [openDate, setOpenDate] = useState<Date | null>(null);

  return (
    <PageLayout
      // header={
      //     <header className="sticky top-0 z-10 bg-[#ffffff] px-6 py-4 flex items-center gap-1.5">
      //         <button type="button" aria-label="뒤로가기" className="btn-back w-10 h-10"></button>
      //         <h1 className="text-xl font-bold flex-1">방 만들기</h1>
      //         <button type="button" aria-label="메뉴" className="btn-menu w-10 h-10"></button>
      //     </header>
      // }
      bottomArea={
        <>
          <Button variant="primary">
            롤링페이퍼 방 만들기
          </Button>
          {/* <Button variant="secondary" iconClassName="" className="border border-gray-300">
            방 삭제하기
          </Button> */}
        </>
      }
    >
      <h1 className="text-2xl font-bold">타임캡슐 롤링페이퍼</h1>
      <p className="mt-2 text-sm text-gray-600">
        소중한 마음을 담아 미래로 보내는
        <br />우리만의 특별한 공간을 만들어보세요.
      </p>

      <div className="mt-10 space-y-4">
        <Field id="roomTitle" label="방 제목">
          <Input placeholder="방 제목을 입력해주세요" />
        </Field>
        <Field
          id="roomUrl"
          label="나만의 URL 주소"
          helperText="영문 소문자, 숫자, 하이픈(-)만 4자 이상 입력이 가능합니다."
        >
          <Input
            placeholder="방 제목을 입력해주세요"
            rightSlot={(
              <Button variant="sm">
                중복확인
              </Button>
            )}
          />
        </Field>
        <Field
          id="openDate"
          label="공개 날짜"
          helperText="오늘로부터 최대 1년 뒤까지만 설정할 수 있습니다."
        >
          <DatePicker
            value={openDate}
            onChange={setOpenDate}
          />
        </Field>
        <Field id="roomPassword" label="관리자 비밀번호">
          <Input
            type="password"
            iconClassName="icon-lock"
            placeholder="비밀번호 4자리를 입력해주세요"
            inputMode="numeric"
            maxLength={4}
          />
        </Field>
      </div>
    </PageLayout>
  );
}
