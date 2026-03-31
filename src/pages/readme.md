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
