# pages

여기는 라우트와 직접 연결되는 화면 단위 컴포넌트를 둡니다.

## 규칙

- `pages`에는 URL과 연결되는 화면 컴포넌트만 둡니다.
- 페이지 파일명은 `PascalCase`를 사용합니다. 예: `CreateCapsulePage.tsx`
- 페이지는 화면 조합과 흐름에 집중하고, 공통 UI는 `shared/components`에서 가져다 씁니다.
- 페이지는 라우트와 화면 조합에 집중하고, 기능 단위 UI와 로직은 필요에 따라 `features`에서 가져와 사용합니다.
- 페이지 전용 스타일이 필요하면 해당 페이지 가까이에 두고 관리합니다.

## 예시
(2026.03.17 기준 route 네이밍 규칙 안정해져있음)

- `CreateCapsulePage.tsx`: `/create-capsule` 경로와 연결되는 캡슐 만들기 화면

### `CreateCapsulePage.tsx`

- 입력값 제어는 페이지 내부에서 별도 validation을 만들지 않고, 전역에서 사용하는 유틸(`TitleRule`, `SlugRule`, `PasswordRule`)을 그대로 사용합니다.
- 서버 요청은 generated API와 TanStack Query mutation을 사용합니다.
- slug 중복확인은 단순 조회가 아니라 reservation token을 발급받는 예약 흐름입니다.
- 캡슐 생성 요청 시에는 중복확인 단계에서 받은 `reservationToken`을 함께 전달해야 합니다.
- 사용자 안내는 공용 modal store를 사용합니다.
- 생성 성공 시에는 modal의 확인 버튼을 누르면 상세 페이지로 이동합니다.
- 서버 에러 메시지는 백엔드 응답의 `error.message`를 우선 사용합니다.
