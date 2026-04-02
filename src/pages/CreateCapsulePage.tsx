import React, { useState } from "react";
import PageLayout from "../shared/components/layout/PageLayout";
import { Button, DatePicker, Field, Input } from "../shared/components/ui";
import {
  PasswordRule,
  SlugRule,
  TitleRule,
} from "../shared/utils/InputValidatedCheck";

export default function CreateCapsulePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [openDate, setOpenDate] = useState<Date | null>(null);
  const [password, setPassword] = useState("");

  const titleCheck = TitleRule(title);
  const slugCheck = SlugRule(slug);
  const passwordCheck = PasswordRule(password);

  const titleFieldTrue =
    title.length === 0 ? "" : titleCheck.boolean ? "success" : "error";
  const slugFieldTrue =
    slug.length === 0 ? "" : slugCheck.boolean ? "success" : "error";
  const passwordFieldTrue =
    password.length === 0 ? "" : passwordCheck.boolean ? "success" : "error";

  const titleFieldMessage = `${title.length}/100`;
  const slugFieldMessage = `${slug.length}/50`;
  const passwordFieldMessage = `${password.length}/4`;

  const isButtonDisabled =
    !title.trim() ||
    !slug.trim() ||
    !password.trim() ||
    !openDate ||
    !titleCheck ||
    !slugCheck ||
    !passwordCheck;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(TitleRule(e.target.value).value);
  };
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(SlugRule(e.target.value).value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(PasswordRule(e.target.value).value);
  };

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
          <Button variant="primary" disabled={isButtonDisabled}>
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
        <br />
        우리만의 특별한 공간을 만들어보세요.
      </p>

      <div className="mt-10 space-y-4">
        <Field
          id="roomTitle"
          label="방 제목"
          message={titleFieldMessage}
          messageStatus={titleFieldTrue}
        >
          <Input
            placeholder="방 제목을 입력해주세요"
            value={title}
            onChange={handleTitleChange}
          />
        </Field>
        <Field
          id="roomUrl"
          label="나만의 URL 주소"
          helperText="영문 소문자, 숫자, 하이픈(-)만 4자 이상 입력이 가능합니다."
          message={slugFieldMessage}
          messageStatus={slugFieldTrue}
        >
          <Input
            placeholder="방 제목을 입력해주세요"
            value={slug}
            rightSlot={<Button variant="sm">중복확인</Button>}
            onChange={handleSlugChange}
          />
        </Field>
        <Field
          id="openDate"
          label="공개 날짜"
          helperText="오늘로부터 최대 1년 뒤까지만 설정할 수 있습니다."
        >
          <DatePicker value={openDate} onChange={setOpenDate} />
        </Field>
        <Field
          id="roomPassword"
          label="관리자 비밀번호"
          helperText="숫자만 입력 가능합니다."
          message={passwordFieldMessage}
          messageStatus={passwordFieldTrue}
        >
          <Input
            type="password"
            iconClassName="icon-lock"
            placeholder="비밀번호 4자리를 입력해주세요"
            inputMode="numeric"
            value={password}
            onChange={handlePasswordChange}
          />
        </Field>
      </div>
    </PageLayout>
  );
}
