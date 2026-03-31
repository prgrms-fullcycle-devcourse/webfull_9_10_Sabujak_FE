# shared/components

여러 화면과 기능에서 공통으로 사용하는 컴포넌트를 모아두는 폴더입니다.

## 규칙

- 공용으로 재사용하지 않는 UI는 `shared/components`에 두지 않고, 필요한 화면 또는 해당 `feature` 가까이에서 관리합니다.
- 두 개 이상의 화면에서 재사용할 가능성이 있을 때만 `shared/components`에 둡니다.
- 컴포넌트 파일명은 `PascalCase`를 사용합니다. 예: `Button.tsx`, `PageLayout.tsx`
- 공용 레이아웃은 `layout/`, 범용 UI는 `ui/` 아래에 둡니다.
- 스타일이 필요하면 컴포넌트와 가까운 위치에서 관리하되, 전역 스타일은 `src/styles`에 둡니다.
- 컴포넌트는 가능한 한 표시와 재사용에 집중하고, 도메인 검증 로직은 페이지나 훅에서 처리합니다.

## 예시

- `layout/PageLayout.tsx`: 여러 페이지에서 공통으로 사용하는 레이아웃
- `ui/Button.tsx`: 범용 버튼
- `ui/Input.tsx`: 범용 입력 필드
- `ui/Textarea.tsx`: 범용 텍스트 입력 필드
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
        type="button"
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
- `className`: 필요한 추가 스타일을 덧붙일 때 사용합니다.
- `iconClassName`: 버튼 왼쪽 아이콘 span에 붙일 클래스명을 전달합니다.
- `iconClassName`이 있을 때만 아이콘 span이 생성됩니다.
- 공통 아이콘 스타일인 `btn-icon`은 내부에서 자동으로 붙습니다.
- 기본 `button` 속성(`type`, `disabled`, `onClick`)도 그대로 사용할 수 있습니다.
- `Button`의 기본 `type`은 `button`입니다.
- `form` 제출이 필요할 때만 `type="submit"`을 명시해서 사용합니다.

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
          <Button type="button" variant="sm">
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
- `status`: 바깥에서 계산한 `success`, `error` 상태를 표시할 때 사용합니다.
- `iconClassName`을 주면 `field-icon` 공통 클래스는 `Input` 내부에서 자동으로 붙습니다.
- 사용처에서는 `field-icon icon-lock`처럼 두 개를 같이 쓰지 않고, 아이콘 종류만 넘기면 됩니다.
- 기본 `input` 속성(`type`, `placeholder`, `value`, `onChange`)도 그대로 사용할 수 있습니다.

예시:

```tsx
<Input iconClassName="icon-calendar" />
<Input iconClassName="icon-lock" type="password" />
```

## Field 사용법

`Field`는 라벨, 입력 필드, 상태 메시지, 안내 문구를 묶어주는 컴포넌트입니다.

```tsx
import { Field, Input } from "./ui";

export default function Example() {
  return (
    <Field
      id="roomUrl"
      label="나만의 URL 주소"
      message="이미 사용 중인 주소예요."
      messageStatus="error"
      helperText="영문 소문자, 숫자, 하이픈(-)만 4자 이상 입력이 가능합니다."
    >
      <Input placeholder="URL을 입력해주세요" />
    </Field>
  );
}
```

- `id`: label과 input을 연결할 id
- `label`: 필드 라벨
- `message`: 입력 필드 아래에 표시하는 상태 메시지
- `messageStatus`: 바깥에서 계산한 `success`, `error` 상태를 표시할 때 사용합니다.
- `helperText`: 입력 아래 안내 문구
- `children`: 주로 `Input`, `Textarea`, `DatePicker` 같은 입력 컴포넌트
- `Field`는 자식으로 전달한 입력 컴포넌트에 `id`를 자동으로 연결합니다.
- 상태값에 따라 메시지에는 `field-message-{status}`, 입력 필드에는 `is-{status}` 클래스가 적용됩니다.

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

## Modal 사용법

### 종류

- `writeMessage`: 메시지 작성 모달
- `oneButton`: 버튼 1개 모달
- `twoButton`: 버튼 2개 모달
- `capsuleEditCheckModal`: 방 수정 비밀번호 확인 모달

### 옵션

- `title`: 모달 제목
- `content`: 모달 내용
- `option`: 모달 종류. `oneButton`, `twoButton`, `capsuleEditCheckModal`, `writeMessage`
- `buttonText`: 버튼 텍스트 배열
- `onConfirm`: 버튼 클릭 시 실행할 함수 배열

### 사용 예시

1. `oneButton`

```tsx
<Button
  onClick={() =>
    openModal({
      title: "제목",
      content: <p>내용</p>,
      option: "oneButton",
      buttonText: ["확인"],
      onConfirm: [() => {}],
    })
  }
>
  oneButton
</Button>
```

2. `twoButton`

```tsx
<Button
  onClick={() =>
    openModal({
      title: "제목",
      content: <p>내용</p>,
      option: "twoButton",
      buttonText: ["확인", "취소"],
      onConfirm: [() => {}, () => {}],
    })
  }
>
  twoButton
</Button>
```

3. `WriteMessageModal`

```tsx
<Button
  onClick={() =>
    openModal({
      title: "편지 쓰기",
      content: <WriteMessageContent />,
      option: "writeMessage",
    })
  }
>
  writeMessage
</Button>
```

4. `capsuleEditCheckModal`

```tsx
<Button
  onClick={() =>
    openModal({
      title: "어드민 체크",
      content: (
        <CapsuleEditCheckModal
          getRoomName={roomTitle}
          getOpenDate={new Date(openAt)}
        />
      ),
      option: "capsuleEditCheckModal",
    })
  }
>
  capsuleEditCheckModal
</Button>
```
