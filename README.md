# Todo App

AI Agent와 함께 실무형 개발 과정을 연습하기 위해 만든 최소 기능 Todo App이다.

이 앱은 사용자가 할 일을 빠르게 추가하고, 완료 상태를 바꾸고, 필요 없는 할 일을 삭제할 수 있는 체크리스트형 MVP를 목표로 한다.

## 주요 기능

- 할 일 추가
- 할 일 완료 처리와 완료 취소
- 할 일 삭제
- 남은 할 일 개수 표시
- 빈 상태와 입력 오류 표시

## 기술 스택

- Monorepo: npm workspaces
- Web: React, TypeScript, Vite, React Router, Tailwind CSS
- API: NestJS, TypeScript, Zod
- Data: PGlite, Drizzle ORM
- State/Form: TanStack Query, React Hook Form
- Test: Vitest, Testing Library, Playwright
- Quality: Biome

## 프로젝트 구조

```text
apps/
  api/        NestJS API 앱
  web/        Vite React 앱
packages/
  db/         PGlite, Drizzle schema, repository 구현
  domain/     Todo domain model, schema, use case 계약
docs/         제품, 설계, ADR, 개발 가이드
e2e/          Playwright E2E 테스트
```

## 설치

```bash
npm install
```

Playwright E2E를 실행하려면 Chromium 브라우저 바이너리를 한 번 설치한다.

```bash
npx playwright install chromium
```

## 로컬 실행

API와 Web 앱은 별도 터미널에서 실행한다.

```bash
npm run api:dev
```

```bash
npm run web:dev
```

기본 주소:

- Web: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:3000`
- API health check: `http://127.0.0.1:3000/health`

Web dev server는 `/api` 요청을 API 서버로 proxy한다.

## 검증

기본 검증:

```bash
npm run check
```

Web production build:

```bash
npm run web:build
```

Playwright E2E:

```bash
npm run e2e
```

`npm run e2e`는 Playwright 설정을 통해 API 서버와 Web 서버를 자동으로 실행한다.

## 현재 제한

- API는 PGlite in-memory database를 사용하므로 서버를 재시작하면 Todo 데이터가 초기화된다.
- 인증, 사용자 계정, 다중 사용자 데이터 분리는 MVP 범위에 없다.
- E2E는 현재 Chromium만 설정되어 있다.
- Zustand는 설치하지 않았다. 서버와 무관한 클라이언트 UI 상태가 실제로 생기면 도입을 다시 검토한다.

## 문서

Agent 운영 문서:

- [Project Brief](docs/project-brief.md)
- [Current Plan](docs/current-plan.md)
- [Decisions](docs/decisions.md)
- [Task Log](docs/task-log.md)
- [Agent Harness](docs/agent-harness.md)
- [Agent 작업 루프](docs/agent-workflow.md)

제품과 개발 reference:

- [제품 기획서](docs/product-brief.md)
- [요구사항 정의서](docs/requirements.md)
- [사용자 흐름](docs/user-flow.md)
- [개발 가이드](docs/development-guide.md)
- [구현 작업 계획](docs/implementation-plan.md)
- [기술 스택 ADR](docs/adr/0001-tech-stack.md)
- [개발 아키텍처 ADR](docs/adr/0002-development-architecture.md)
