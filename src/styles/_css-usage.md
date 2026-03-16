# css 파일 규칙
1. 전역 커스텀 CSS와 컴포넌트/페이지 전용 CSS를 분리

styles/ = 프로젝트 전체에 영향을 주는 전역 CSS
```css
src/
├─ styles/
│  ├─ popup.css
│  └─ icons.css
```

*.module.css = 특정 컴포넌트나 페이지에만 적용되는 로컬 CSS
```css
src/
├─ shared/
│  └─ components/
│     ├─ layout/
│     │  ├─ PageLayout.tsx
│     │  └─ PageLayout.module.css
│     └─ ui/
│        ├─ Button.tsx
│        └─ Button.module.css
├─ pages/
│  ├─ Home/
│  └─ Login/
│     ├─ Login.tsx
│     └─ Login.module.css
```

- 공용 컴포넌트 스타일은 `src/shared/components` 아래에 둡니다.
- 현재 공용 컴포넌트는 폴더를 한 단계 더 만들지 않고 파일 단위로 관리합니다.
- 특정 페이지에서만 쓰는 스타일은 해당 페이지 폴더 안에서 `*.module.css`로 관리합니다.

<!-- 2. 단위는 rem을 쓴다. (반응형이 가능한 테일윈드 사용)
0.8px === 0.8rem
10px === 1rem
16px === 1.6rem
24px === 2.4rem -->

# 사용 전 준비

아이콘을 사용하려면 `icons.css`가 먼저 import되어 있어야 합니다.
예를 들어 전역 스타일 파일(`src/index.css`)에서 아래처럼 한 번 import하면 됩니다.

```css
@import "./styles/icons.css";
```
---

## icons.css 사용 가이드 (:root style 사용법 동일)

`icons.css`는 SVG 아이콘을 CSS 커스텀 프로퍼티(`--ico-*`)로 관리하는 파일입니다.
아이콘을 직접 이미지 파일로 import하지 않고, 필요한 곳에서 `var(--ico-이름)` 형태로 재사용할 수 있습니다.

### 1. 파일 위치

- 아이콘 정의 파일: `src/styles/icons.css`

### 2. 기본 사용법

현재 `icons.css`의 값은 `url(...)` 형태이므로 주로 아래 방식으로 사용합니다.

#### 예시 전체 코드

##### `index.css`

```css
@import "tailwindcss";
@import "./styles/icons.css";
```

##### `icons.css`

```css
:root {
  --ico-lock: url("data:image/svg+xml,...");
  --ico-copy: url("data:image/svg+xml,...");
}
```

##### 커스텀 CSS

```css
.icon-lock {
  display: inline-block;
  width: 14px;
  height: 16px;
  background-image: var(--ico-lock);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.btn-copy::before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 16px;
  margin-right: 4px;
  background-image: var(--ico-copy);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
```

##### JSX

```tsx
export default function Example() {
  return (
    <div>
      <p className="flex items-center gap-1">
        <span className="icon-lock" aria-hidden="true"></span>
        비밀번호
      </p>

      <button className="btn-copy">복사하기</button>
    </div>
  );
}
```

### 3. 새 아이콘 추가 방법

새 아이콘이 필요하면 `:root` 아래에 같은 형식으로 추가합니다.

```css
:root {
  --ico-new-name: url("data:image/svg+xml,%3Csvg ... %3C/svg%3E");
}
```

추가할 때는 아래 규칙을 맞춰주세요.

- 변수명 규칙: `--ico-기능명`
- 네이밍 예시: `--ico-search`, `--ico-edit`, `--ico-close`
- 여러 화면에서 공통으로 쓰는 아이콘만 등록
- 특정 페이지 전용 아이콘은 공통 파일이 아니라 해당 컴포넌트 내부 스타일에서 관리하는 것도 고려

---
