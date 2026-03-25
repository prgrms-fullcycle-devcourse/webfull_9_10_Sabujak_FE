# room

타임캡슐 방 화면과 관련된 기능을 관리합니다.

## components

- `OpenViewBefore.tsx`: 캡슐 오픈 전 화면
- `OpenView.tsx`: 캡슐 오픈 후 화면
- `UnavailableView.tsx`: 잘못된 링크 또는 존재하지 않는 방 안내 화면
- `HeartJar.tsx`: 오픈 전 화면의 하트병 UI
- `CountdownTimer.tsx`: room 전용 카운트다운 표시 UI

## hooks

- `useRoomDetail.ts`: 현재 room 상세 mock 데이터를 반환하는 훅
- `useShare.ts`: 링크 공유/복사 기능을 처리하는 훅
- `useHeartJarAnimation.ts`: 하트병 애니메이션

## constants

- `heartJar.ts`: 하트병 관련 상수

## utils

- `shareDebug.ts`: 공유 기능 테스트를 위한 개발용 디버그 유틸

## 참고

- room 상세 조회는 현재 mock 기반으로 동작합니다.
- 타입은 Orval generated model 기준으로 사용합니다.
- 공통 countdown 계산 로직과 상태 관리는 `shared` 레이어에서 관리합니다.
