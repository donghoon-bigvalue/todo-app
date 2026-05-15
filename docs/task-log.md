# Task Log

이 문서는 완료된 Agent 작업의 짧은 기록을 남기는 운영 문서다. 상세 변경 내용은 git commit 또는 각 문서를 확인한다.

## 기록 원칙

- 한 task가 끝날 때마다 목적, 변경 파일, 검증, 남은 리스크를 짧게 남긴다.
- 커밋이 있으면 commit hash를 기록한다.
- 검증 실패 상태에서는 실패 내용을 먼저 기록하고 커밋하지 않는다.
- 긴 설명은 관련 문서에 남기고 이 문서는 인덱스 역할을 유지한다.

## 2026-05-14: Agent Harness 기준 문서 추가

상태: Done

목적:

- 사용자의 아이디어를 제품 초안, 문서화, task 실행으로 연결하는 하네스 기준을 정리한다.

변경 파일:

- `docs/agent-harness.md`

핵심 변경:

- 초안 우선형 Idea Intake를 정의했다.
- 채팅 승인 후 문서화 원칙을 정했다.
- 승인 게이트, 컨텍스트 관리, archive 기준을 정리했다.

검증:

- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- 기존 작업 루프 문서와 AGENTS 지침에 새 하네스 기준을 점진적으로 반영해야 한다.

## 2026-05-14: agent-work-loop skill 업데이트

상태: Done

목적:

- Agent가 실제 작업 시 `docs/agent-harness.md`를 따르도록 로컬 skill을 갱신한다.

변경 파일:

- `.codex/skills/agent-work-loop/SKILL.md`

핵심 변경:

- 시작 전 확인 대상에 `docs/agent-harness.md`를 추가했다.
- 초안 우선형 Idea Intake 절차를 skill에 반영했다.
- `docs/current-plan.md`가 있으면 task 선택 기준으로 우선 사용하도록 정리했다.
- 승인되지 않은 제품 초안을 문서화하지 않는 경계 규칙을 추가했다.

검증:

- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- `docs/current-plan.md` 등 운영 문서가 아직 없어 다음 task에서 추가가 필요했다.

## 2026-05-14: Agent 운영 문서 추가

상태: Done

목적:

- Agent가 매번 긴 문서 전체를 읽지 않도록 짧은 운영 문서 세트를 추가한다.

변경 파일:

- `docs/project-brief.md`
- `docs/current-plan.md`
- `docs/decisions.md`
- `docs/task-log.md`

핵심 변경:

- 프로젝트와 하네스 목표를 짧은 기본 컨텍스트로 요약한다.
- 현재 phase와 다음 task 후보를 분리한다.
- 주요 제품, 기술, 하네스 결정을 인덱스로 정리한다.
- 최근 Agent Harness 작업 기록을 누적한다.

검증:

- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- `docs/agent-workflow.md`, `AGENTS.md`, README는 아직 새 운영 문서 우선순위를 직접 반영하지 않았다.

## 2026-05-14: agent-workflow 문서 정리

상태: Done

목적:

- Agent 실행 루프 문서가 새 하네스 기준과 충돌하지 않도록 역할과 시작 전 확인 순서를 정리한다.

변경 파일:

- `docs/agent-workflow.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- `docs/agent-workflow.md`를 승인된 task 실행 루프 문서로 역할을 좁혔다.
- 새 아이디어 intake와 채팅 승인 후 문서화는 `docs/agent-harness.md`를 따르도록 정리했다.
- 시작 전 확인 문서를 운영 문서 중심으로 조정했다.
- 다음 task 후보를 `AGENTS.md` 정리로 갱신했다.

검증:

- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- `AGENTS.md`와 README는 아직 새 운영 문서 우선순위를 직접 반영하지 않았다.

## 2026-05-14: AGENTS 지침 정리

상태: Done

목적:

- 저장소 최상위 Agent 지침이 새 하네스 기준과 운영 문서 우선순위를 따르도록 정리한다.

변경 파일:

- `AGENTS.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- 작업 루프 규칙에 `docs/agent-harness.md`를 추가했다.
- 기본 컨텍스트 우선순위를 운영 문서 중심으로 정리했다.
- 제품 초안 승인 전 문서화 금지 규칙을 추가했다.
- 문서 작성 규칙에 `current-plan`과 `task-log` 갱신 기준을 추가했다.

검증:

- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- README는 아직 새 Agent Harness와 운영 문서 링크를 직접 반영하지 않았다.

## 2026-05-14: README 문서 링크 정리

상태: Done

목적:

- 저장소 첫 진입자가 Agent Harness와 운영 문서 구조를 발견할 수 있게 한다.

변경 파일:

- `README.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- README 문서 섹션에 Agent 운영 문서 그룹을 추가했다.
- 기존 제품과 개발 reference 문서는 별도 그룹으로 유지했다.
- 다음 task 후보를 archive 기준 검토로 갱신했다.

검증:

- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- 기존 상세 문서는 아직 archive하지 않았다. 현재 방침은 유지이며, 필요할 때 별도 task로 검토한다.

## 2026-05-14: Husky Git hook 도입

상태: Done

목적:

- commit과 push 전에 검증 명령을 자동 실행해 Agent Harness의 검증 규칙을 Git 이벤트에 연결한다.

변경 파일:

- `package.json`
- `package-lock.json`
- `.husky/pre-commit`
- `.husky/pre-push`
- `README.md`
- `docs/development-guide.md`
- `docs/decisions.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- `husky`를 devDependency로 추가했다.
- `prepare` script로 Husky 초기화를 설정했다.
- `pre-commit`에서 `format:check`, `lint`, `typecheck`를 실행한다.
- `pre-push`에서 `npm run check`를 실행한다.
- E2E는 기본 hook에 넣지 않고 task별 별도 검증으로 남겼다.

검증:

- `.husky/pre-commit` 통과
- `.husky/pre-push` 통과
- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- Playwright E2E는 기본 hook에 포함하지 않았다. UI 흐름 변경 task에서는 별도 검증으로 실행해야 한다.

## 2026-05-14: Todo 메모 기능 문서화

상태: Done

목적:

- 승인된 Todo 메모 기능 초안을 제품 문서, 디자인 문서, 구현 계획에 반영한다.

변경 파일:

- `docs/project-brief.md`
- `docs/product-brief.md`
- `docs/requirements.md`
- `docs/user-flow.md`
- `docs/design-brief.md`
- `docs/implementation-plan.md`
- `docs/current-plan.md`
- `docs/decisions.md`
- `docs/task-log.md`

핵심 변경:

- Todo 메모를 생성 후 인라인으로 추가, 수정, 비우는 확장 범위로 정리했다.
- 메모는 선택 입력이며 최대 500자로 제한한다.
- 목록에서는 메모를 2줄까지 표시하고, 편집은 한 번에 하나의 Todo에서만 열리도록 정했다.
- 구현 계획에 Todo 메모 확장 phase와 Task 27~33을 추가했다.
- UI 영향도 누락을 보정해 Figma 디자인 업데이트를 코드 구현 전 선행 task로 추가했다.

검증:

- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- 아직 구현은 시작하지 않았다. 다음 task는 Todo note Figma 디자인 업데이트다.

## 2026-05-14: Figma-before-code 게이트 보강

상태: Done

목적:

- 새 화면, 컴포넌트, UI 상태가 생기는 기능은 코드 구현 전에 Figma 작업을 먼저 계획하도록 하네스 규칙을 보강한다.

변경 파일:

- `docs/agent-harness.md`
- `docs/agent-workflow.md`
- `.codex/skills/agent-work-loop/SKILL.md`
- `docs/implementation-plan.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- UI 영향도 판정 기준을 `docs/agent-harness.md`에 추가했다.
- UI 영향이 있으면 Figma task를 코드 구현 task보다 먼저 두도록 정했다.
- `agent-workflow`와 `agent-work-loop` skill에 Figma 선행 작업 확인을 추가했다.
- Todo 메모 확장 Phase 7의 첫 task를 Figma 디자인 업데이트로 보정했다.

검증:

- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- 실제 Figma 파일 업데이트는 아직 진행하지 않았다. 다음 task는 Todo note Figma 디자인 업데이트다.

## 2026-05-14: Todo note Figma 디자인 업데이트

상태: Done

목적:

- 메모가 있는 Todo Item과 메모 편집 상태를 코드 구현 전에 Figma 기준으로 먼저 정의한다.

변경 파일:

- `docs/figma-plan.md`
- `docs/current-plan.md`
- `docs/task-log.md`

Figma 변경:

- Components에 `Todo Item / with note` 추가
- Components에 `Todo Item / note editing` 추가
- Screens에 `05 메모 있는 상태` 추가
- Screens에 `06 메모 편집 상태` 추가
- Feedback Components 섹션을 아래로 이동해 확장된 Todo Components와 겹치지 않게 정리

검증:

- `Todo Components` node `13:7` metadata 확인
- `05 메모 있는 상태` node `55:25` metadata 확인
- `06 메모 편집 상태` node `55:64` metadata 확인
- `Feedback Components` node `13:12` metadata 확인
- screenshot으로 Components, 메모 있는 상태, 메모 편집 상태 확인

커밋:

- 미커밋

남은 리스크:

- Figma 시각 검토는 Agent가 screenshot으로 확인한 수준이다. 사용자가 Figma에서 직접 보고 세부 시각 피드백을 줄 수 있다.

## 2026-05-15: Todo note domain과 schema 확장

상태: Done

목적:

- Todo domain model과 note 입력 검증 규칙에 선택 메모를 추가한다.

변경 파일:

- `packages/domain/src/todo.ts`
- `packages/domain/src/todo.test.ts`
- `packages/domain/src/todo-note-schema.ts`
- `packages/domain/src/todo-note-schema.test.ts`
- `packages/domain/src/todo-use-cases.test.ts`
- `packages/domain/src/index.ts`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- Todo snapshot에 선택 `note` 필드를 추가했다.
- Todo 생성 시 note 기본값은 `null`이다.
- 기존 snapshot에 note가 없어도 `null`로 복원해 다음 DB task 전까지 하위 호환을 유지한다.
- `todoNoteSchema`를 추가해 앞뒤 공백 제거, 공백 입력의 `null` 정리, 최대 500자 제한을 검증한다.

검증:

- `npm run test -- packages/domain/src/todo.test.ts packages/domain/src/todo-note-schema.test.ts packages/domain/src/todo-use-cases.test.ts` 통과
- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- DB schema와 repository는 아직 note를 저장하지 않는다. 다음 task에서 저장 구조를 확장해야 한다.

## 2026-05-15: Todo note 저장 구조와 repository 확장

상태: Done

목적:

- Todo note를 DB에 저장하고 repository에서 조회, 수정, 비우기 할 수 있게 한다.

변경 파일:

- `packages/db/src/schema.ts`
- `packages/db/src/todo-repository.ts`
- `packages/db/src/todo-repository.test.ts`
- `packages/db/src/migrate.test.ts`
- `packages/db/drizzle/0001_add_todo_note.sql`
- `packages/db/drizzle/meta/_journal.json`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- `todos` table에 nullable `note` 컬럼을 추가했다.
- note 컬럼 추가 migration을 추가했다.
- repository create/update가 Todo note를 저장한다.
- repository restore가 DB row의 note를 Todo snapshot에 포함한다.
- note 저장, 수정, 비우기 repository integration test를 추가했다.

검증:

- `npm run test -- packages/db/src/migrate.test.ts packages/db/src/todo-repository.test.ts` 통과
- `npm run check` 통과

커밋:

- `feat(db): Todo 메모 저장 구조 추가`

남은 리스크:

- API use case와 controller는 아직 note 수정 요청을 처리하지 않는다. 다음 task에서 API 경계를 확장해야 한다.

## 2026-05-15: Todo note use case와 API 확장

상태: Done

목적:

- Todo note 수정을 application use case, backend API, web shared API client까지 연결한다.

변경 파일:

- `packages/domain/src/todo-use-cases.ts`
- `packages/domain/src/todo-use-cases.test.ts`
- `packages/domain/src/index.ts`
- `apps/api/src/todos/todos.tokens.ts`
- `apps/api/src/todos/application/todo-use-case.providers.ts`
- `apps/api/src/todos/presentation/todos.controller.ts`
- `apps/api/src/todos/presentation/todos.controller.test.ts`
- `apps/api/src/todos/todos.module.test.ts`
- `apps/web/src/shared/api/todo-api.ts`
- `apps/web/src/shared/api/todo-api.test.ts`
- `apps/web/src/shared/api/index.ts`
- `apps/web/src/pages/todo-page.test.tsx`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- `UpdateTodoNoteUseCase`를 추가해 Todo note 수정, 비우기, 없는 Todo 에러를 처리한다.
- Todo note 입력은 `todoNoteSchema`로 검증하고 500자 초과를 거절한다.
- `PATCH /todos/:id/note` API를 추가했다.
- Todo API 응답에 `note`를 포함했다.
- web shared API client에 `updateTodoNote`와 note 응답 검증을 추가했다.

검증:

- `npm run test -- packages/domain/src/todo-use-cases.test.ts apps/api/src/todos/presentation/todos.controller.test.ts apps/api/src/todos/todos.module.test.ts apps/web/src/shared/api/todo-api.test.ts apps/web/src/pages/todo-page.test.tsx` 통과
- `npm run check` 통과

커밋:

- `feat(todo): Todo 메모 API 확장`

남은 리스크:

- Todo Item UI는 아직 note 표시와 편집 상태를 제공하지 않는다. 다음 task에서 Figma 기준 UI component와 showcase를 확장해야 한다.
