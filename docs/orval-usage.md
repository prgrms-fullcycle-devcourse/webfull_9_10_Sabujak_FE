# Orval Guide

## Orval이 하는 일

Orval은 백엔드 OpenAPI 문서를 읽어서 아래 코드를 자동으로 만들어줍니다.

- API 요청 함수
- 요청/응답 타입
- TanStack Query 훅

즉, 우리가 API 코드를 손으로 하나씩 만들지 않게 도와주는 도구입니다.

## 우리 팀 기준

우리 팀은 백엔드 명세의 기준을 로컬 파일이 아니라 배포된 OpenAPI URL로 잡습니다.

지금 사용하는 주소는 아래입니다.

`https://webfull-9-10-sabujak-be.onrender.com/openapi.json`

중요한 점:

- 백엔드가 로컬에서만 바뀌고 아직 배포되지 않았다면, 프론트에서 `pnpm orval`을 실행해도 그 변경은 반영되지 않습니다.
- 프론트는 백엔드 변경이 배포된 뒤에 다시 생성하면 됩니다.
- 생성 결과가 이상해 보이면 먼저 배포된 OpenAPI 문서가 최신인지 확인합니다.

## 생성 명령어

```bash
pnpm orval
```

이 명령어를 실행하면 `src/shared/api/generated` 아래 코드와
`src/shared/api/generated/index.ts`가 다시 만들어집니다.

현재 `package.json` 기준으로 이 프로젝트는 `orval@7.7.0`을 사용합니다.

## 생성되는 위치

- `src/shared/api/generated/capsule/capsule.ts`
- `src/shared/api/generated/message/message.ts`
- `src/shared/api/generated/model`

또한 `src/shared/api/orval/mutator.ts`에서 기존 Axios 인스턴스인
`src/shared/api/axios.ts`를 재사용합니다.

그래서 generated 코드도 같은 `withCredentials` 설정을 그대로 사용합니다.
런타임 요청 주소는 `src/shared/api/axios.ts`의 `baseURL` 설정을 따르며,
현재 예제 환경 변수 파일인 `.env.example`에서는 `VITE_API_URL=http://localhost:3000`으로 되어 있습니다.

## 직접 수정하면 안 되는 파일

아래 폴더는 `pnpm orval`을 다시 실행할 때마다 덮어써집니다.

- `src/shared/api/generated/**`

즉, generated 파일은 직접 수정하지 않는 것이 원칙입니다.

수정이 필요할 때는 아래 중 하나를 바꿔야 합니다.

- 백엔드 OpenAPI 문서
- `orval.config.ts`
- `src/shared/api/orval/mutator.ts`
- generated 훅을 사용하는 컴포넌트 코드

## 사용 전에 알아둘 점

생성된 훅은 TanStack Query 기반입니다.

그래서 `useGetCapsulesSlug`, `usePostCapsules` 같은 훅을 쓰려면 앱이 `QueryClientProvider`로 감싸져 있어야 합니다.

이 프로젝트는 이미 `src/main.tsx`에서 `QueryClientProvider`를 설정해 두었습니다.

대부분의 페이지나 컴포넌트에서는 바로 사용하면 됩니다.

## 예시: 조회 훅

```tsx
import { useGetCapsulesSlug } from "../shared/api/generated/capsule/capsule";

type CapsuleDetailProps = {
  slug: string;
};

export function CapsuleDetail({ slug }: CapsuleDetailProps) {
  const { data, isPending, isError } = useGetCapsulesSlug(slug);

  if (isPending) return <div>Loading...</div>;
  if (isError || !data) return <div>Failed to load capsule.</div>;

  return (
    <section>
      <h1>{data.title}</h1>
      <p>{data.slug}</p>
      <p>{data.isOpen ? "opened" : "closed"}</p>
    </section>
  );
}
```

위 import 경로는 예시입니다.
실제 코드에서는 현재 컴포넌트 위치에 맞게 상대 경로를 조정해야 합니다.

## 예시: 생성 훅

```tsx
import { usePostCapsules } from "../shared/api/generated/capsule/capsule";

export function CreateCapsuleButton() {
  const createCapsule = usePostCapsules();

  const handleClick = async () => {
    await createCapsule.mutateAsync({
      data: {
        slug: "our-graduation-2025",
        title: "졸업 축하 타임캡슐",
        password: "1234",
        openAt: "2025-12-25T12:00:00.000Z",
        reservationToken: "01HQX7Y8J6R8J2E5W4C2R9A1BC",
      },
    });
  };

  return <button onClick={handleClick}>Create capsule</button>;
}
```

## 자주 쓰게 될 훅 이름

- `useGetCapsulesSlug`
- `usePostCapsules`
- `usePostCapsulesSlugReservations`
- `usePostCapsulesSlugVerify`
- `usePostCapsulesSlugMessages`

## 정리

- 기준 명세는 로컬 파일이 아니라 배포 URL입니다.
- Orval 입력 명세 URL과 런타임 API `baseURL`은 서로 다른 설정입니다.
- generated 파일은 직접 수정하지 않습니다.
- 백엔드 배포 후 `pnpm orval`로 다시 생성합니다.
- 생성된 훅은 이미 설정된 `QueryClientProvider` 안에서 바로 사용할 수 있습니다.
