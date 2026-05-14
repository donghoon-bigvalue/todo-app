# 개발 가이드

이 문서는 Todo App을 개발할 때 사용하는 기본 실행 및 검증 명령을 정리한다.

## 전제

- package manager는 npm을 사용한다.
- 프로젝트는 npm workspaces 기반 monorepo다.
- 작업은 `docs/implementation-plan.md`의 task 단위로 진행한다.
- 각 task는 검증을 통과한 뒤 하나의 커밋으로 기록한다.

## 설치

```bash
npm install
```

Playwright E2E를 실행하려면 브라우저 바이너리를 한 번 설치한다.

```bash
npx playwright install chromium
```

## Workspace 확인

```bash
npm run workspaces:list
```

목적:

- npm이 `apps/*`, `packages/*` workspace를 인식하는지 확인한다.

## 기본 검증

```bash
npm run check
```

`check`는 다음 명령을 순서대로 실행한다.

```bash
npm run workspaces:list
npm run format:check
npm run lint
npm run typecheck
npm run test
```

Agent는 일반적인 task를 마친 뒤 `npm run check`를 기본 검증 명령으로 사용한다.

특정 task에서 더 좁거나 더 넓은 검증이 필요하면 해당 검증을 추가로 실행하고 완료 보고에 남긴다.

## Git hooks

Husky를 사용해 commit과 push 전에 기본 검증을 실행한다.

`pre-commit`은 빠른 정적 검증만 실행한다.

```bash
npm run format:check
npm run lint
npm run typecheck
```

`pre-push`는 원격 반영 전 전체 기본 검증을 실행한다.

```bash
npm run check
```

Playwright E2E는 기본 hook에 포함하지 않는다. UI 흐름을 바꾸는 task에서는 Agent가 별도 검증으로 `npm run e2e`를 실행하고 완료 보고에 남긴다.

## 로컬 실행

API와 Web 앱은 각각 별도 터미널에서 실행한다.

```bash
npm run api:dev
```

기본 API 주소:

```text
http://127.0.0.1:3000
```

API 상태 확인:

```text
http://127.0.0.1:3000/health
```

Web 앱 실행:

```bash
npm run web:dev
```

기본 Web 주소:

```text
http://127.0.0.1:5173
```

Web dev server는 `/api` 요청을 `http://127.0.0.1:3000`으로 proxy한다. 실제 Todo 동작을 확인하려면 API 서버와 Web 서버가 모두 실행 중이어야 한다.

## 테스트

단위, 컴포넌트, 통합 테스트를 실행한다.

```bash
npm run test
```

브라우저 기반 E2E 테스트를 실행한다.

```bash
npm run e2e
```

`npm run e2e`는 Playwright 설정을 통해 API 서버와 Web 서버를 자동으로 실행한다.

E2E에서 사용하는 기본 포트:

- API: `3000`
- Web: `5173`

이미 같은 포트에 서버가 실행 중이면 Playwright는 로컬 개발 편의를 위해 기존 서버를 재사용한다. CI 환경에서는 기존 서버를 재사용하지 않고 테스트가 직접 서버를 띄운다.

## 빌드

Web 앱 production build를 확인한다.

```bash
npm run web:build
```

## 포맷

```bash
npm run format
```

Biome 기준으로 파일을 자동 포맷한다.

커밋 전에는 `npm run format:check` 또는 `npm run check`로 포맷 상태를 확인한다.

## 타입 검사

```bash
npm run typecheck
```

현재는 루트 TypeScript 설정을 기준으로 `apps/`, `packages/`, `types/` 아래 TypeScript 파일을 검사한다.

각 workspace에 앱과 패키지가 구체화되면 필요한 경우 workspace별 `tsconfig`를 추가한다.

## Lint

```bash
npm run lint
```

Biome recommended rule을 기준으로 검사한다.

규칙을 완화하거나 추가해야 하면 작업 중 임의로 바꾸지 않고, 이유를 문서화한 뒤 변경한다.

## Database migration

현재 migration은 `packages/db/drizzle` 아래의 SQL 파일과 Drizzle journal 파일로 관리한다.

- SQL 파일은 실제 적용할 DDL을 담는다.
- `packages/db/drizzle/meta/_journal.json`은 Drizzle migrator가 적용 순서를 읽기 위해 사용한다.
- migration 적용은 `packages/db/src/migrate.ts`의 `applyMigrations`를 사용한다.

Todo table schema는 `packages/db/src/schema.ts`의 Drizzle schema와 SQL migration을 함께 수정한다.

schema 변경이 반복되어 수동 관리 비용이 커지면 `drizzle-kit` 도입을 별도 task로 검토한다.

## 현재 제한

- API는 PGlite in-memory database를 사용하므로 서버를 재시작하면 Todo 데이터가 초기화된다.
- 인증, 사용자 계정, 다중 사용자 데이터 분리는 MVP 범위에 없다.
- E2E는 Chromium 프로젝트만 설정되어 있다. 다른 브라우저가 필요하면 Playwright project를 추가한다.
- Zustand는 현재 설치하지 않는다. 서버와 무관한 클라이언트 UI 상태가 실제로 생기면 도입을 다시 검토한다.
