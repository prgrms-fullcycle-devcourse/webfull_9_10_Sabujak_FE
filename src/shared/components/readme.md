# shared/components

여기는 여러 화면과 기능에서 함께 사용하는 공용 컴포넌트를 둡니다.

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

`Button`은 기본적으로 `primary`, `white` variant를 지원합니다.

```tsx
import { Button } from "./ui/Button";

export default function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="primary">확인</Button>
      <Button variant="white" className="border border-gray-300">
        취소
      </Button>
    </div>
  );
}
```

- `variant`: 버튼 스타일 종류를 지정합니다.
- `className`: 필요한 추가 스타일을 덧붙일 수 있습니다.
- 기본 `button` 속성(`type`, `disabled`, `onClick`)도 함께 사용할 수 있습니다.

## Button variant 추가 방법

새 버튼 스타일이 필요하면 `ui/Button.tsx`의 `buttonVariantClassNameMap`에 variant를 추가합니다.

```tsx
const buttonVariantClassNameMap = {
  primary: "bg-[#000000] text-[#ffffff]",
  white: "text-[#000000]",
  danger: "bg-red-500 text-white",
} as const;
```

추가 후에는 아래처럼 사용할 수 있습니다.

```tsx
<Button variant="danger">삭제</Button>
```

- 공통으로 반복해서 쓸 버튼 스타일만 variant로 추가합니다.
- 특정 화면에서만 잠깐 쓰는 스타일이면 `className`으로 처리하는 쪽이 더 적절합니다.
