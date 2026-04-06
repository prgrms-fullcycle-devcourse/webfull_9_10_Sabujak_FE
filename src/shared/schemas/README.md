# Shared Zod Schemas

프론트엔드에서 바로 사용할 수 있도록 추린 순수 `zod` 스키마 모음입니다.

## 포함 범위

- `capsules`: 캡슐 관련 요청/응답 스키마와 공통 필드 스키마
- `common/error-response`: 공통 에러 응답 스키마

## 특징

- `zod`만 의존합니다.
- 백엔드 전용 `openapi()` 확장과 mock example 의존성을 제거했습니다.
- `z.infer` 기반 타입도 함께 export 합니다.
- 폴더 안에 별도 `package.json`이 있어 독립 모듈처럼 옮기기 쉽습니다.

## 사용 예시

```ts
import { createCapsuleBodySchema, type CreateCapsuleBody } from "./index";

const parsed = createCapsuleBodySchema.parse(formValues);
```

## 전달 방법

이 `shared-schemas` 폴더만 압축해서 프론트 저장소로 전달하면 됩니다.
