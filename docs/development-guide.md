# 개발 가이드

이 문서는 Todo App을 개발할 때 사용하는 기본 실행 및 검증 명령을 정리한다.

## 전제

- package manager는 npm을 사용한다.
- 프로젝트는 npm workspaces 기반 monorepo다.
- 작업은 `docs/implementation-plan.md`의 task 단위로 진행한다.
- 각 task는 검증을 통과한 뒤 하나의 커밋으로 기록한다.

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
```

Agent는 일반적인 task를 마친 뒤 `npm run check`를 기본 검증 명령으로 사용한다.

특정 task에서 더 좁거나 더 넓은 검증이 필요하면 해당 검증을 추가로 실행하고 완료 보고에 남긴다.

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
