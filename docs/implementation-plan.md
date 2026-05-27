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

## Phase 7: Todo 메모 확장

### Task 27: Todo note Figma 디자인 업데이트

목적:

- 메모가 있는 Todo Item과 메모 편집 상태를 Figma 기준으로 먼저 정의한다.

완료 조건:

- Components 또는 화면 상태에 메모가 있는 Todo Item 상태가 있다.
- 메모 편집 중 상태가 있다.
- 메모는 제목 아래 2줄 표시 기준으로 표현된다.
- 메모 추가 또는 수정 버튼, textarea, 저장 버튼, 취소 버튼의 배치가 정해져 있다.
- 기존 기본, 완료, 에러 상태와 시각적으로 어긋나지 않는다.
- 대표 노드 metadata로 정렬과 크기를 검증한다.

검증:

- Figma metadata 확인
- 필요 시 screenshot 확인

### Task 28: Todo note domain과 schema 확장

목적:

- Todo에 선택 메모를 저장할 수 있도록 domain model과 입력 검증 규칙을 확장한다.

완료 조건:

- Todo model에 선택 `note` 필드가 있다.
- note는 비어 있을 수 있다.
- note 최대 길이는 500자다.
- 빈 문자열이나 공백만 저장하면 note 없음으로 정리된다.
- 기존 title 검증 규칙은 유지된다.

검증:

- domain unit test와 schema unit test가 통과한다.

### Task 29: Todo note 저장 구조와 repository 확장

목적:

- DB와 repository가 Todo note를 저장, 조회, 수정, 비우기 할 수 있게 한다.

완료 조건:

- Todo table에 note 컬럼이 있다.
- migration이 준비되어 있다.
- findMany 결과에 note가 포함된다.
- repository에서 note 업데이트와 note 비우기가 가능하다.
- 기존 create, toggle, delete 동작은 유지된다.

검증:

- DB schema 또는 migration 테스트가 통과한다.
- repository integration test가 통과한다.

### Task 30: Todo note use case와 API 확장

목적:

- frontend가 Todo note를 수정하거나 비울 수 있는 API를 제공한다.

완료 조건:

- note 수정 use case가 있다.
- note 최대 길이를 검증한다.
- 빈 note 저장 요청은 note 없음으로 처리한다.
- Todo 응답에 note가 포함된다.
- note 수정 API가 있다.
- 기존 list, create, toggle, delete API는 유지된다.

검증:

- application test가 통과한다.
- controller test가 통과한다.

### Task 31: Todo Item note UI와 showcase 확장

목적:

- Figma 기준에 맞춰 Todo Item이 메모 표시와 메모 편집 상태를 표현할 수 있게 한다.

완료 조건:

- 메모가 있는 Todo Item은 제목 아래에 메모를 2줄까지 표시한다.
- 메모 버튼은 메모가 없으면 추가, 있으면 수정 의미를 가진다.
- 메모 편집 상태에는 textarea, 저장 버튼, 취소 버튼이 있다.
- `/showcase`에서 메모 있음과 메모 편집 중 상태를 확인할 수 있다.

검증:

- component test와 build가 통과한다.

### Task 32: Todo note 편집 기능 연결

목적:

- 실제 Todo 화면에서 사용자가 생성된 할 일의 메모를 추가, 수정, 비울 수 있게 한다.

완료 조건:

- 할 일 생성 form은 기존처럼 title만 입력한다.
- 메모 편집은 한 번에 하나의 Todo에서만 열린다.
- 저장하면 서버에 반영되고 목록에 갱신된다.
- 빈 값으로 저장하면 메모가 삭제된다.
- 취소하면 기존 메모가 유지된다.
- 완료된 할 일도 메모를 수정할 수 있다.

검증:

- 사용자 행동 중심 component test가 통과한다.
- `npm run check`가 통과한다.

### Task 33: Todo note E2E 확장

목적:

- 실제 브라우저에서 메모 추가, 수정, 비우기 흐름을 검증한다.

완료 조건:

- Todo 생성 후 메모를 추가할 수 있다.
- 메모를 수정할 수 있다.
- 빈 값 저장으로 메모를 비울 수 있다.
- 기존 추가, 완료, 삭제 흐름은 유지된다.

검증:

- Playwright E2E 테스트가 통과한다.

## Phase 8: Auth와 계정 관리 확장

### Task 34: Auth 기능 제품 문서화

목적:

- 승인된 Auth 기능 초안을 제품 문서, 요구사항, 사용자 흐름, 디자인 브리프, 구현 계획, ADR에 반영한다.

완료 조건:

- 회원가입, 로그인, 로그아웃, 토큰 갱신, 아이디 찾기, 비밀번호 재설정, 로그인 후 비밀번호 변경, 회원탈퇴 범위가 문서에 정리되어 있다.
- 로그인 ID와 이메일 분리 정책이 문서에 있다.
- JWT access token과 HTTP-only cookie refresh token 전략이 ADR에 있다.
- Nodemailer 기반 실제 메일 발송 결정이 ADR에 있다.
- 회원탈퇴 hard delete 결정이 ADR에 있다.

검증:

- `npm run check`가 통과한다.

### Task 35: Auth Figma 디자인 업데이트

목적:

- Auth 확장에 필요한 화면과 form 상태를 코드 구현 전에 Figma 기준으로 정의한다.

완료 조건:

- 로그인 화면이 있다.
- 회원가입 화면이 있다.
- 아이디 찾기 이메일 입력, 인증 코드 입력, 결과 화면이 있다.
- 비밀번호 재설정 이메일 입력, 인증 코드 입력, 새 비밀번호 설정 화면이 있다.
- 로그인 후 비밀번호 변경 화면이 있다.
- 회원탈퇴 확인 화면이 있다.
- Todo 화면에 사용자 닉네임, 로그아웃, 계정 관리 진입이 표현되어 있다.
- 대표 노드 metadata 또는 screenshot으로 레이아웃을 검증한다.

검증:

- Figma metadata 확인
- 필요 시 screenshot 확인

### Task 36: Auth domain model과 schema 정의

목적:

- UI, API, DB에 의존하지 않는 사용자, 인증, 이메일 인증, refresh token 핵심 규칙을 정의한다.

완료 조건:

- User model에 id, loginId, nickname, email, passwordHash, createdAt이 있다.
- loginId, nickname, email, password 입력 검증 schema가 있다.
- 이메일 인증 코드 생성, 만료, 사용 처리 규칙이 있다.
- refresh token snapshot과 만료 규칙이 있다.
- 비밀번호 hash 세부 라이브러리 선택이 기록되어 있다.

검증:

- domain unit test와 schema unit test가 통과한다.

### Task 37: Auth 저장 구조와 repository 확장

목적:

- 사용자, refresh token, 이메일 인증 기록을 저장하고 Todo를 사용자 소유 데이터로 분리한다.

완료 조건:

- users table이 있다.
- refresh_tokens table이 있다.
- email_verifications table이 있다.
- todos table에 user id 참조가 있다.
- 사용자 삭제 시 관련 Todo, refresh token, 이메일 인증 기록이 함께 삭제된다.
- repository가 사용자 조회, 생성, 비밀번호 변경, 삭제를 지원한다.
- repository가 refresh token 저장, 검증용 조회, 무효화를 지원한다.
- repository가 이메일 인증 생성, 조회, 사용 처리를 지원한다.

검증:

- migration 테스트가 통과한다.
- repository integration test가 통과한다.

### Task 38: Nodemailer mail sender 구현

목적:

- 이메일 인증 코드를 실제 메일로 발송할 수 있는 infrastructure를 만든다.

완료 조건:

- mail sender interface가 있다.
- Nodemailer 기반 구현이 있다.
- SMTP 환경변수 설정이 문서화되어 있다.
- 테스트에서는 fake sender를 사용할 수 있다.
- 메일 발송 실패를 application 계층에서 다룰 수 있다.

검증:

- mail sender unit test 또는 integration seam test가 통과한다.
- `npm run check`가 통과한다.

### Task 39: Auth API 기본 인증 흐름 구현

목적:

- 회원가입, 로그인, refresh, 로그아웃 API를 제공한다.

완료 조건:

- 회원가입 API가 있다.
- 로그인 API가 access token을 응답 body로 반환한다.
- 로그인 API가 refresh token을 HTTP-only cookie로 설정한다.
- refresh API가 cookie의 refresh token으로 access token을 재발급한다.
- 로그아웃 API가 refresh token을 무효화하고 cookie를 정리한다.
- 요청 검증 실패와 인증 실패가 명확한 에러 응답을 반환한다.

검증:

- application test가 통과한다.
- controller test가 통과한다.

### Task 40: 아이디 찾기와 비밀번호 재설정 API 구현

목적:

- 이메일 인증 기반 아이디 찾기와 비밀번호 재설정 API를 제공한다.

완료 조건:

- 아이디 찾기 인증 코드 요청 API가 있다.
- 아이디 찾기 인증 코드 확인 API가 있다.
- 인증 성공 후 로그인 ID를 반환한다.
- 비밀번호 재설정 인증 코드 요청 API가 있다.
- 비밀번호 재설정 인증 코드 확인 API가 있다.
- 인증 성공 후 새 비밀번호로 변경할 수 있다.
- 비밀번호 재설정 후 기존 refresh token이 무효화된다.

검증:

- application test가 통과한다.
- controller test가 통과한다.

### Task 41: Todo API 인증 보호와 사용자별 데이터 분리

목적:

- 기존 Todo API가 로그인한 사용자의 Todo만 다루도록 확장한다.

완료 조건:

- Todo API는 access token 인증을 요구한다.
- Todo 생성 시 현재 사용자 id가 저장된다.
- 목록 조회는 현재 사용자 Todo만 반환한다.
- 완료 변경, 메모 수정, 삭제는 현재 사용자 Todo에만 적용된다.
- 다른 사용자의 Todo id로 접근하면 실패한다.
- 기존 Todo 기능 요구사항은 로그인 후 유지된다.

검증:

- application test가 통과한다.
- controller test가 통과한다.
- 기존 Todo page component test가 필요한 범위에서 갱신되어 통과한다.

### Task 42: Web Auth 화면과 token 흐름 연결

목적:

- 사용자가 웹에서 회원가입, 로그인, 로그아웃, token refresh 흐름을 사용할 수 있게 한다.

완료 조건:

- 로그인 화면이 있다.
- 회원가입 화면이 있다.
- 로그인 후 Todo 화면에 접근할 수 있다.
- 미로그인 사용자는 Todo 화면에서 로그인 화면으로 이동한다.
- access token은 API 요청에 포함된다.
- refresh 실패 시 로그인 화면으로 이동한다.
- 로그아웃하면 인증 상태가 해소된다.

검증:

- 사용자 행동 중심 component test가 통과한다.
- API client test가 통과한다.
- `npm run check`가 통과한다.

### Task 43: Web 계정 복구와 계정 관리 화면 연결

목적:

- 사용자가 아이디 찾기, 비밀번호 재설정, 로그인 후 비밀번호 변경, 회원탈퇴를 웹에서 수행할 수 있게 한다.

완료 조건:

- 아이디 찾기 화면에서 이메일 인증과 로그인 ID 확인을 할 수 있다.
- 비밀번호 재설정 화면에서 이메일 인증 후 새 비밀번호를 설정할 수 있다.
- 로그인 후 비밀번호 변경 화면이 있다.
- 회원탈퇴 확인 화면이 있다.
- 회원탈퇴 후 로그인 화면으로 이동한다.

검증:

- 사용자 행동 중심 component test가 통과한다.
- `npm run check`가 통과한다.

### Task 44: Auth E2E 확장

목적:

- 실제 브라우저에서 Auth 핵심 흐름과 사용자별 Todo 분리를 검증한다.

완료 조건:

- 회원가입 후 로그인할 수 있다.
- 로그인 후 Todo를 생성할 수 있다.
- 로그아웃 후 Todo 화면 접근이 제한된다.
- 다른 사용자로 로그인하면 이전 사용자의 Todo가 보이지 않는다.
- 아이디 찾기 흐름을 검증한다.
- 비밀번호 재설정 후 새 비밀번호로 로그인할 수 있다.
- 로그인 후 비밀번호 변경 흐름을 검증한다.
- 회원탈퇴 후 해당 계정으로 로그인할 수 없다.

검증:

- Playwright E2E 테스트가 통과한다.
- `npm run check`가 통과한다.
