# 구현 작업 계획

이 문서는 Todo App을 실제 구현으로 옮길 때 사용할 작업 단위 계획이다.

각 작업은 하나의 커밋 후보가 될 수 있을 만큼 작게 유지한다. AI Agent는 이 문서에서 다음 작업을 제안할 수 있지만, 사용자의 승인 없이 다음 phase나 다음 task를 임의로 진행하지 않는다.

## 진행 원칙

- 한 번에 하나의 task만 진행한다.
- 각 task는 목적, 완료 조건, 검증 방법을 가진다.
- 기능 구현 task는 TDD 흐름을 기본으로 한다.
- 작업 중 새 요구사항이 발견되면 즉시 구현하지 않고 문서나 후속 task 후보로 기록한다.
- 기술 스택과 아키텍처 결정은 `docs/adr/` 문서를 따른다.
- Figma와 코드 디자인 시스템 작업은 관련 로컬 skill을 따른다.

## Phase 0: 프로젝트 하네스

### Task 01: npm workspaces 기반 monorepo 초기화

목적:

- `apps/`, `packages/` 기준의 작업 공간을 만든다.
- 이후 frontend, backend, domain, db 작업을 독립적으로 진행할 수 있게 한다.

완료 조건:

- 루트 `package.json`에 workspace 설정이 있다.
- 기본 디렉터리 구조가 생성되어 있다.
- 불필요한 앱 코드는 아직 만들지 않는다.

검증:

- package manager가 workspace를 인식한다.

### Task 02: 공통 TypeScript와 Biome 설정

목적:

- 전체 저장소의 타입 검사와 lint/format 기준을 마련한다.

완료 조건:

- 공통 TypeScript 설정이 있다.
- Biome 설정과 기본 스크립트가 있다.

검증:

- format/lint 명령이 실행 가능하다.

### Task 03: 기본 scripts와 작업 검증 루프 정리

목적:

- Agent가 매 작업 후 실행할 기본 검증 명령을 정한다.

완료 조건:

- 루트 scripts에 최소 검증 명령이 있다.
- README 또는 개발 문서에 실행 방법이 정리되어 있다.

검증:

- 루트에서 기본 검증 명령이 실패 없이 실행된다.

## Phase 1: Domain

### Task 04: Todo domain model 정의

목적:

- UI, API, DB에 의존하지 않는 Todo 핵심 규칙을 정의한다.

완료 조건:

- Todo id, title, completed, createdAt 등 최소 필드가 정의되어 있다.
- 완료 상태 변경 규칙이 domain 계층에 있다.

검증:

- domain unit test가 통과한다.

### Task 05: Todo 입력 검증 schema 정의

목적:

- frontend와 backend가 공유할 수 있는 Todo 입력 검증 규칙을 만든다.

완료 조건:

- 빈 title을 거부한다.
- title 길이 제한이 있다.
- Zod schema와 테스트가 있다.

검증:

- schema unit test가 통과한다.

### Task 06: Todo use case 계약 정의

목적:

- 목록 조회, 생성, 완료 변경, 삭제 유스케이스의 경계를 정한다.

완료 조건:

- repository interface가 있다.
- use case가 concrete DB 구현에 의존하지 않는다.

검증:

- fake repository 기반 application test가 통과한다.

## Phase 2: Database

### Task 07: PGlite와 Drizzle 초기 설정

목적:

- 로컬 PostgreSQL 유사 환경에서 Todo 데이터를 저장할 기반을 만든다.

완료 조건:

- `packages/db`가 생성되어 있다.
- PGlite와 Drizzle 기본 연결 코드가 있다.

검증:

- DB 연결 또는 초기화 테스트가 통과한다.

### Task 08: Todo table schema와 migration 준비

목적:

- Todo 저장 구조를 명시적으로 관리한다.

완료 조건:

- Todo table schema가 있다.
- migration 생성 또는 적용 방식이 문서화되어 있다.

검증:

- schema 또는 migration 관련 테스트가 통과한다.

### Task 09: Todo repository 구현

목적:

- application 계층의 repository 계약을 Drizzle/PGlite로 구현한다.

완료 조건:

- create, findMany, updateCompleted, delete 동작이 있다.
- domain/application이 Drizzle 세부사항에 의존하지 않는다.

검증:

- repository integration test가 통과한다.

## Phase 3: API

### Task 10: NestJS API 앱 초기화

목적:

- backend 앱의 기본 실행 구조를 만든다.

완료 조건:

- `apps/api`가 생성되어 있다.
- NestJS 앱이 최소 상태로 실행된다.

검증:

- API test 또는 bootstrap test가 통과한다.

### Task 11: Todos module 구조 생성

목적:

- presentation, application, domain, infrastructure 경계를 가진 Todo API 구조를 만든다.

완료 조건:

- Todos module이 있다.
- controller, use case, repository provider 경계가 정리되어 있다.

검증:

- module 관련 테스트가 통과한다.

### Task 12: Todo API 핵심 동작 구현

목적:

- frontend가 사용할 최소 Todo API를 제공한다.

완료 조건:

- list, create, toggle, delete API가 있다.
- 요청 검증 실패 시 에러 응답을 반환한다.

검증:

- controller/application 테스트가 통과한다.

## Phase 4: Web 디자인 시스템

### Task 13: Vite React 앱과 Router 초기화

목적:

- 실제 앱 화면과 showcase 화면을 분리할 frontend 기반을 만든다.

완료 조건:

- `apps/web`이 생성되어 있다.
- `/`와 `/showcase` 라우트가 있다.

검증:

- frontend test 또는 build가 통과한다.

### Task 14: Tailwind와 shared UI 기반 설정

목적:

- Figma 컴포넌트를 코드 디자인 시스템으로 옮길 기반을 만든다.

완료 조건:

- Tailwind CSS v4가 설정되어 있다.
- `cn` 유틸이 있다.
- Pretendard 웹폰트가 포함되어 있다.

검증:

- frontend build 또는 style 관련 smoke test가 통과한다.

### Task 15: Button 컴포넌트와 showcase 구현

목적:

- Figma Button을 코드 컴포넌트로 옮긴다.

완료 조건:

- `shared/ui`에 Button이 있다.
- `/showcase`에서 상태별 Button을 확인할 수 있다.

검증:

- component test와 build가 통과한다.

### Task 16: Text Input과 Checkbox 컴포넌트 구현

목적:

- Todo 입력과 완료 상태 변경에 필요한 form control을 만든다.

완료 조건:

- Text Input과 Checkbox가 있다.
- Figma 기준의 수직 정렬이 반영되어 있다.
- `/showcase`에서 상태별 예시를 확인할 수 있다.

검증:

- component test와 build가 통과한다.

### Task 17: Todo Item, Empty State, Error Message 구현

목적:

- 실제 Todo 화면을 구성할 표시 컴포넌트를 만든다.

완료 조건:

- Todo Item, Empty State, Error Message가 있다.
- 완료 항목은 취소선으로 표시된다.
- `/showcase`에서 상태별 예시를 확인할 수 있다.

검증:

- component test와 build가 통과한다.

## Phase 5: Web 기능

### Task 18: axios 기반 API client 구성

목적:

- frontend에서 backend API를 일관되게 호출한다.

완료 조건:

- API client와 Todo API 함수가 있다.
- 에러 응답 처리 기준이 있다.

검증:

- API client unit test가 통과한다.

### Task 19: TanStack Query로 Todo 목록 조회

목적:

- 서버 상태로 Todo 목록을 조회하고 화면에 표시한다.

완료 조건:

- 실제 Todo 화면에서 목록 상태를 렌더링한다.
- 빈 상태를 표시한다.

검증:

- 사용자 행동 중심 component test가 통과한다.

### Task 20: react-hook-form과 Zod로 Todo 추가

목적:

- 사용자가 새 Todo를 추가할 수 있게 한다.

완료 조건:

- 빈 입력 시 에러 메시지를 보여준다.
- 유효한 입력은 API 호출 후 목록에 반영된다.

검증:

- form component test가 통과한다.

### Task 21: 완료 변경과 삭제 구현

목적:

- 사용자가 Todo 완료 상태를 바꾸고 삭제할 수 있게 한다.

완료 조건:

- 체크박스로 완료 상태를 변경한다.
- 삭제 버튼을 누르면 즉시 삭제된다.

검증:

- toggle/delete component test가 통과한다.

### Task 22: Zustand 적용 여부 결정

목적:

- 클라이언트 UI 상태가 실제로 필요한지 확인하고, 필요한 경우에만 Zustand를 적용한다.

완료 조건:

- 적용 또는 미적용 이유가 기록되어 있다.
- 적용한다면 서버 상태와 섞이지 않는다.

검증:

- 관련 테스트가 통과한다.

## Phase 6: E2E와 문서

### Task 23: Playwright 설정

목적:

- 브라우저 기반 핵심 흐름 검증을 준비한다.

완료 조건:

- Playwright 설정이 있다.
- frontend/backend 실행 방식이 테스트와 연결되어 있다.

검증:

- Playwright smoke test가 통과한다.

### Task 24: 핵심 사용자 흐름 E2E 작성

목적:

- Todo 추가, 완료, 삭제 흐름을 실제 브라우저에서 검증한다.

완료 조건:

- 핵심 사용자 흐름 E2E 테스트가 있다.

검증:

- Playwright 테스트가 통과한다.

### Task 25: 개발 가이드 정리

목적:

- 이후 작업자가 프로젝트를 실행하고 검증하는 방법을 알 수 있게 한다.

완료 조건:

- README 또는 docs에 실행, 테스트, 검증 방법이 있다.
- 남은 작업과 알려진 제한이 정리되어 있다.

검증:

- 문서의 명령이 실제로 실행 가능하다.

### Task 26: README 작성

목적:

- 저장소 첫 진입자가 프로젝트 목적, 구조, 실행 방법, 검증 방법을 빠르게 파악할 수 있게 한다.

완료 조건:

- 루트 `README.md`가 있다.
- 주요 기능, 기술 스택, 프로젝트 구조, 설치, 실행, 검증, 현재 제한, 관련 문서 링크가 정리되어 있다.

검증:

- README에 적은 주요 명령이 실제로 실행 가능하다.
