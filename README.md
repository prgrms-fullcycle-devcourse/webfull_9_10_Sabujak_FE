
---

# 사부작(Sabujak)

> 너 몰래 사부작사부작, 특별한 날 한 번에 열리는 비밀 롤링페이퍼

## 🔗 링크 (Links)
- **배포 주소**: https://webfull-9-10-sabujak-fe.vercel.app

---

## 🛠 기술 스택 (Tech Stack)

### **Frontend**

| 영역              | 기술 |
|------------------|------|
| Build            | Vite |
| UI               | React |
| Language         | TypeScript |
| Package Manager  | pnpm |
| Styling          | Tailwind CSS |
| State (Client)   | Zustand |
| State (Server)   | TanStack Query |
| HTTP             | Axios |
| Validation       | Zod |
| Deployment       | Vercel |

### **Backend**

| 영역              | 기술 |
|------------------|------|
| Language         | TypeScript |
| Package Manager  | pnpm |
| Server           | Express |
| Deployment       | Render |
| Container        | Docker |
| Testing          | Jest |
| Database         | Neon PostgreSQL |
| ORM              | Drizzle ORM |
| API Spec         | OpenAPI |
| Monitoring       | Sentry |
| Logging          | Pino |

### **DevOps / QA**

| 영역              | 기술 |
|------------------|------|
| CI               | GitHub Actions |
| CD               | Render |
| Monitoring       | Sentry |
| Git Hooks        | Husky, lint-staged |
| Testing          | Jest |
| Logging          | Pino |

---

## 📂 폴더 구조 (Folder Structure)

```text
src/
 ├── assets/        # 이미지, 폰트, 아이콘 등 정적 파일
 ├── features/      # 도메인 단위 기능
 ├── pages/         # 라우팅되는 페이지 컴포넌트
 ├── shared/        # 전역에서 공통으로 사용하는 것들
 │   ├── api/           # API 요청 함수
 │   ├── components/    # 공통 컴포넌트
 │   │   ├── layout/    # 레이아웃
 │   │   └── ui/        # 버튼, 인풋 등 기본 UI
 │   ├── hooks/         # 공통 커스텀 훅
 │   ├── query/         # TanStack Query 관련 설정
 │   ├── store/         # 전역 상태 관리
 │   ├── types/         # 공통 타입 정의
 │   └── utils/         # 유틸 함수
 ├── styles/        # 전역 스타일 (css, tailwind 설정 등)
 └── App.tsx        # 최상위 컴포넌트
```

---

## 📝 커밋 컨벤션 (Commit Convention)

저희 프로젝트는 원활한 협업을 위해 다음과 같은 커밋 메시지 규칙을 따릅니다.

| 태그 | 설명 |
| --- | --- |
| **Feat** | 기능 추가 |
| **Fix** | 버그 수정 |
| **Docs** | 문서 수정 (README, TIL 등) |
| **Style** | 코드 포맷팅, 세미콜론 누락 등 (코드 로직 변경 없음) |
| **Refactor** | 코드 리팩토링 (기능 변경 없이 구조 개선) |
| **Test** | 테스트 코드 추가 혹은 수정 |
| **Deploy** | 배포 관련 작업 |
| **Chore** | 빌드 업무 수정, 패키지 매니저 설정 등 (프로덕션 코드 변경 없음) |
| **Merge** | 브랜치를 합치다가 난 충돌을 해결했을 때 수정 |

---

## 🚀 로컬 실행 방법 (Getting Started)

프로젝트를 로컬 환경에서 실행하고 테스트하는 방법입니다.

### 1. 레포지토리 클론 및 폴더 이동
```bash
git clone https://github.com/prgrms-fullcycle-devcourse/webfull_9_10_Sabujak_FE

cd webfull_9_10_Sabujak_FE
```

### 2. 패키지 설치
```bash
pnpm install
```

### 3. 환경 변수 설정
프로젝트 최상위 경로에 `.env` 파일을 생성하고 `.env.example`을 참고하여 환경 변수를 채워주세요.

### 4. 프로젝트 실행
```bash
pnpm dev        # 개발 모드 실행

pnpm start      # 프로덕션 실행
```

---

## 🧑‍💻 팀원 소개 (Team)

| 프로필 | 이름 | 역할 | GitHub |
|--------|------|------|--------|
| <img src="https://github.com/labyrinth30.png" width="50" /> | 이윤하 | Backend | [@labyrinth30](https://github.com/labyrinth30) |
| <img src="https://github.com/insu1170.png" width="50" /> | 김인수 | Backend | [@insu1170](https://github.com/insu1170) |
| <img src="https://github.com/s576air.png" width="50" /> | 한재민 | Frontend | [@s576air](http://github.com/s576air) |
| <img src="https://github.com/supersoldier132.png" width="50" /> | 송창욱 | Frontend | [@supersoldier132](https://github.com/supersoldier132) |
| <img src="https://github.com/yomiyoni.png" width="50" /> | 이연희 | Frontend | [@yomiyoni](https://github.com/yomiyoni) |

---

