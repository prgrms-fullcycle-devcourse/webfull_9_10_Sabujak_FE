# shared/components

여러 화면과 기능에서 공통으로 사용하는 컴포넌트를 모아두는 폴더입니다.

## 규칙

- 공용으로 재사용하지 않는 UI는 `shared/components`에 두지 않고, 필요한 화면 또는 해당 `feature` 가까이에서 관리합니다.
- 두 개 이상의 화면에서 재사용할 가능성이 있을 때만 `shared/components`에 둡니다.
- 컴포넌트 파일명은 `PascalCase`를 사용합니다. 예: `Button.tsx`, `PageLayout.tsx`
- 공용 레이아웃은 `layout/`, 범용 UI는 `ui/` 아래에 둡니다.
- 스타일이 필요하면 컴포넌트와 가까운 위치에서 관리하되, 전역 스타일은 `src/styles`에 둡니다.
- 컴포넌트 내부에서 도메인 로직을 직접 들고 있기보다, 가능한 한 표시와 재사용에 집중합니다.

## 예시

- `layout/PageLayout.tsx`: 여러 페이지에서 공통으로 사용하는 레이아웃
- `ui/Button.tsx`: 범용 버튼
- `ui/Input.tsx`: 범용 입력 필드
- `ui/DatePicker.tsx`: 범용 날짜 선택 UI

## Button 사용법

`Button`은 현재 `primary`, `secondary`, `sm` variant를 지원합니다.

```tsx
import { Button } from "./ui";

export default function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="primary">롤링페이퍼 방 만들기</Button>

      <Button variant="secondary" className="border border-gray-300">
        취소
      </Button>

      <Button
        variant="secondary"
        iconClassName="btn-icon-lock"
        className="border border-gray-300"
      >
        방 삭제하기
      </Button>
    </div>
  );
}
```

- `variant`: 버튼 스타일 종류를 지정합니다.
- `className`: 필요한 추가 스타일을 덮어쓸 때 사용합니다.
- `iconClassName`: 버튼 왼쪽 아이콘 span에 붙일 클래스명을 전달합니다.
- `iconClassName`이 있을 때만 아이콘 span이 생성됩니다.
- 공통 아이콘 스타일인 `btn-icon`은 내부에서 자동으로 붙습니다.
- 사용처에서는 실제 아이콘 클래스명만 넘기면 됩니다.
- 기본 `button` 속성(`type`, `disabled`, `onClick`)도 그대로 사용할 수 있습니다.
- `Button`의 기본 `type`은 `button`입니다.
- `form` 제출이 필요한 경우에만 `type="submit"`을 명시해서 사용합니다.

예시:

```tsx
<Button iconClassName="btn-icon-download">이미지로 저장하기</Button>
<Button iconClassName="btn-icon-lock">방 삭제하기</Button>
<Button type="submit">저장</Button>
```

아이콘 클래스는 `src/styles/common.css`와 `src/styles/icons.css`에 정의되어 있어야 합니다.

## Button variant 추가 방법

새 버튼 스타일이 여러 화면에서 공통으로 반복된다면 `ui/Button.tsx`의 `buttonVariantClassNameMap`에 variant를 추가합니다.

```tsx
const buttonVariantClassNameMap = {
  primary: "bg-[#000000] text-[#ffffff] p-4",
  secondary: "text-[#000000] p-4",
} as const;
```

추가한 뒤에는 아래처럼 사용할 수 있습니다.

```tsx
<Button variant="primary">확인</Button>
```

- 공통으로 반복해서 쓰는 버튼 스타일만 variant로 추가합니다.
- 특정 화면에서만 잠깐 쓰는 스타일이면 `className`으로 처리하는 쪽이 더 적절합니다.

## Input 사용법

`Input`은 기본 입력 필드이며, 오른쪽 슬롯과 필드 아이콘을 지원합니다.

```tsx
import { Button, Input } from "./ui";

export default function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Input placeholder="방 제목을 입력해주세요" />

      <Input
        type="password"
        iconClassName="icon-lock"
        placeholder="비밀번호 4자리를 입력해주세요"
      />

      <Input
        placeholder="나만의 URL 주소를 입력해주세요"
        rightSlot={(
          <Button variant="sm">
            중복확인
          </Button>
        )}
      />
    </div>
  );
}
```

- `className`: 바깥 wrapper(`field-control`)에 추가할 클래스
- `inputClassName`: 실제 `<input>`에 추가할 클래스
- `rightSlot`: input 오른쪽에 붙는 보조 요소
- `iconClassName`: 필드 아이콘 종류 클래스명
- `iconClassName`을 주면 `field-icon` 공통 클래스는 `Input` 내부에서 자동으로 붙습니다.
- 사용처에서는 `field-icon icon-lock`처럼 두 개를 같이 쓰지 않고, 아이콘 종류만 넘기면 됩니다.
- 기본 `input` 속성(`type`, `placeholder`, `value`, `onChange`)도 그대로 사용할 수 있습니다.

예시:

```tsx
<Input iconClassName="icon-calendar" />
<Input iconClassName="icon-lock" type="password" />
```

## Field 사용법

`Field`는 라벨, 입력 필드, 안내 문구를 묶어주는 컴포넌트입니다.

```tsx
import { Field, Input } from "./ui";

export default function Example() {
  return (
    <Field
      id="roomUrl"
      label="나만의 URL 주소"
      helperText="영문 소문자, 숫자, 하이픈(-)만 4자 이상 입력이 가능합니다."
    >
      <Input placeholder="URL을 입력해주세요" />
    </Field>
  );
}
```

- `id`: label과 input을 연결할 id
- `label`: 필드 라벨
- `helperText`: 입력 아래 안내 문구
- `children`: 주로 `Input`, `DatePicker` 같은 입력 컴포넌트
- `Field`는 자식으로 전달한 입력 컴포넌트에 `id`를 자동으로 연결합니다.
- `Input`, `DatePicker` 같은 입력형 컴포넌트와 함께 사용하는 것을 기본으로 합니다.

## 같이 쓰는 예시

```tsx
<Field
  id="roomPassword"
  label="관리자 비밀번호"
  helperText="비밀번호 4자리를 입력해주세요."
>
  <Input
    type="password"
    iconClassName="icon-lock"
    placeholder="비밀번호 4자리를 입력해주세요"
  />
</Field>
```
