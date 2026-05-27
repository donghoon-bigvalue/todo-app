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

- `4460eaf feat(api): Nodemailer 메일 발송기 추가`

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

- `a0d3f6c feat(api): Auth 기본 인증 API 추가`

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

## 2026-05-15: Todo Item note UI와 showcase 확장

상태: Done

목적:

- Figma의 Todo Item note 상태를 shared UI component와 `/showcase`에 반영한다.

변경 파일:

- `apps/web/src/shared/ui/todo-item.tsx`
- `apps/web/src/shared/ui/todo-item.test.tsx`
- `apps/web/src/pages/showcase-page.tsx`
- `apps/web/src/app/app.test.tsx`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- Todo Item에 note 표시 상태를 추가했다.
- Todo Item에 note 편집 textarea, 저장 버튼, 취소 버튼 상태를 추가했다.
- 메모 추가/수정 버튼을 Todo Item header에 배치했다.
- `/showcase`에 기본, 완료, note 표시, note 편집 상태를 함께 노출했다.

검증:

- `npm run test -- apps/web/src/shared/ui/todo-item.test.tsx apps/web/src/app/app.test.tsx apps/web/src/pages/todo-page.test.tsx apps/web/src/pages/showcase-page.tsx` 통과
- `npm run check` 통과

커밋:

- `feat(todo): Todo 메모 UI 상태 추가`

남은 리스크:

- TodoPage는 아직 note 편집 상태와 `updateTodoNote` 호출을 연결하지 않는다. 다음 task에서 실제 사용자 흐름을 연결해야 한다.

## 2026-05-15: Todo note 편집 기능 연결

상태: Done

목적:

- TodoPage에서 Todo note 표시, 추가, 수정, 비우기 사용자 흐름을 연결한다.

변경 파일:

- `apps/web/src/pages/todo-page.tsx`
- `apps/web/src/pages/todo-page.test.tsx`
- `apps/web/src/shared/ui/todo-item.tsx`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- TodoPage가 Todo note를 목록에 표시하도록 연결했다.
- 모든 Todo에 메모 추가/수정 버튼을 제공한다.
- 한 번에 하나의 Todo만 note 편집 상태가 되도록 했다.
- 저장 시 `updateTodoNote`를 호출하고 목록을 다시 조회한다.
- 빈 문자열 저장은 `note: null` 요청으로 처리한다.
- 취소 시 API 호출 없이 기존 목록 상태로 돌아간다.

검증:

- `npm run test -- apps/web/src/pages/todo-page.test.tsx` 통과
- `npm run test -- apps/web/src/pages/todo-page.test.tsx apps/web/src/shared/ui/todo-item.test.tsx apps/web/src/shared/api/todo-api.test.ts` 통과
- `npm run check` 통과

커밋:

- `feat(todo): Todo 메모 편집 흐름 연결`

남은 리스크:

- 브라우저 E2E에서는 아직 note 추가, 수정, 비우기 흐름을 검증하지 않는다. 다음 task에서 E2E를 확장해야 한다.

## 2026-05-15: Todo note E2E 확장

상태: Done

목적:

- 실제 브라우저에서 Todo note 추가, 수정, 비우기와 단일 편집 흐름을 검증한다.

변경 파일:

- `e2e/todo-flow.e2e.ts`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- Todo note 추가, 수정, 비우기 E2E 시나리오를 추가했다.
- 메모 편집은 한 번에 하나의 Todo에서만 열린다는 E2E 시나리오를 추가했다.
- 완료된 Todo에서도 note를 추가하고 저장할 수 있음을 E2E로 검증했다.
- 입력 form의 `추가` 버튼 locator를 exact match로 고정해 note 추가 버튼과 혼동하지 않게 했다.
- 연속 Todo 생성 시 첫 생성과 form reset을 기다린 뒤 다음 Todo를 입력하도록 E2E를 안정화했다.

검증:

- `npm run e2e` 통과
- `npm run check` 통과

커밋:

- `test(e2e): Todo 메모 브라우저 흐름 검증`

남은 리스크:

- Todo 메모 확장의 계획된 구현 task는 완료되었다. 다음에는 회고나 새로운 제품 개선 후보를 논의할 수 있다.

## 2026-05-27: Auth 기능 제품 문서화

상태: Done

목적:

- 승인된 Auth와 계정 관리 확장 초안을 제품 문서와 구현 계획에 반영한다.

변경 파일:

- `docs/project-brief.md`
- `docs/product-brief.md`
- `docs/requirements.md`
- `docs/user-flow.md`
- `docs/design-brief.md`
- `docs/implementation-plan.md`
- `docs/decisions.md`
- `docs/adr/0003-auth-account-strategy.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- 로그인 ID, 닉네임, 이메일, 비밀번호 기반 회원가입 범위를 정리했다.
- 로그인 ID 기반 로그인, 로그아웃, JWT access token, HTTP-only cookie refresh token 전략을 정리했다.
- Nodemailer 기반 실제 메일 발송과 이메일 인증 기반 아이디 찾기, 비밀번호 재설정 흐름을 추가했다.
- 로그인 후 비밀번호 변경과 hard delete 기반 회원탈퇴 범위를 추가했다.
- Auth 구현 계획을 Task 34~44로 나누었다.
- 다음 task를 Auth Figma 디자인 업데이트로 갱신했다.

검증:

- `npm run check` 통과

커밋:

- `0c87d08 docs(auth): 계정 기능 확장 계획 정리`

남은 리스크:

- password hash 라이브러리와 비용 설정은 아직 확정하지 않았다.
- access token과 refresh token 만료 시간은 아직 확정하지 않았다.
- 실제 SMTP provider와 환경변수 값은 아직 확정하지 않았다.
- Auth 화면 기준은 다음 Figma task에서 먼저 정의해야 한다.

## 2026-05-27: Figma 파일 참조 복구

상태: Done

목적:

- 사용자가 복원한 Figma 파일을 이후 작업 기준으로 사용하도록 문서의 file key와 URL을 갱신한다.

변경 파일:

- `docs/figma-plan.md`
- `docs/task-log.md`

핵심 변경:

- Figma 기준 file key를 `COA4ynKukuVp6aqqe1ECPM`으로 갱신했다.
- Cover, Design System, Components, Screens 기준 URL을 복원된 Figma 파일로 교체했다.

검증:

- `rg -n "COA4ynKukuVp6aqqe1ECPM|figma.com/design" docs/figma-plan.md`
- `npm run check` 통과

커밋:

- `dcb0d55 docs(figma): 복원된 Figma 파일 참조 갱신`

남은 리스크:

- Figma 캔버스 자체는 이번 task에서 수정하지 않았다.
- Auth Figma 디자인 업데이트를 재개하기 전에 새 file key로 read-only metadata inventory를 먼저 확인해야 한다.

## 2026-05-27: Figma 작업 안전 규칙 보강

상태: Done

목적:

- Figma 작업 중 기존 디자인을 삭제하거나 스타일을 깨뜨리지 않도록 로컬 skill과 작업 계획 문서의 안전 규칙을 보강한다.

변경 파일:

- `.codex/skills/figma-design-sync/SKILL.md`
- `docs/figma-plan.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- Figma 쓰기 작업 전 read-only inventory 확인과 사용자 보고를 필수화했다.
- `clearPage(...)`, 기존 노드 `remove()`, page 전체 비우기, 기존 frame/component/screen 삭제를 금지했다.
- 새 컴포넌트와 새 화면은 기존 page 끝 영역 또는 별도 section에 추가하도록 정했다.
- 새 컴포넌트와 화면은 기존 디자인 토큰, 컴포넌트 크기, 화면 width, padding, 문구 톤을 유지하도록 명시했다.
- 기존 스타일과 다른 새 패턴이 필요하면 먼저 사용자 확인을 받도록 했다.

검증:

- `npm run check` 통과

커밋:

- `d51b4bd docs(figma): Figma 작업 안전 규칙 보강`

남은 리스크:

- 다음 Auth Figma 디자인 업데이트에서는 실제 metadata inventory 결과를 확인하고, 기존 node 삭제 없이 새 영역에만 추가해야 한다.

## 2026-05-27: Auth Figma 디자인 업데이트

상태: Done

목적:

- Auth 확장에 필요한 컴포넌트와 화면 상태를 기존 Figma 디자인 스타일을 유지하면서 추가한다.

변경 파일:

- `docs/figma-plan.md`
- `docs/current-plan.md`
- `docs/task-log.md`

Figma 변경:

- Components에 `Auth Components` 추가: node `2006:2`
- Components에 `Auth Form Controls` 추가
- Components에 `Auth Form / 로그인` 추가
- Screens에 `Auth Screens` 추가: node `2006:51`
- Screens에 로그인, 회원가입, 아이디 찾기, 비밀번호 재설정 인증, 새 비밀번호 설정, 계정 관리, 회원탈퇴 확인, 로그인 후 Todo 화면 추가

핵심 변경:

- 기존 Components와 Screens를 삭제하거나 덮어쓰지 않고 오른쪽 바깥 영역에 새 Auth 섹션을 추가했다.
- 기존 색상, typography, radius, 390px 화면 width, 24px padding, form card 스타일을 유지했다.
- form 내부 Text Input과 Password Input은 310x42 기준으로 정리했다.
- primary button은 310x28 기준으로 정리했다.

검증:

- 쓰기 전 read-only inventory 확인
- `Auth Components` node `2006:2` metadata 확인
- `Auth Screens` node `2006:51` metadata 확인
- screenshot으로 Components와 Screens 확인
- `npm run check` 통과

커밋:

- `df8f888 docs(figma): Auth 디자인 상태 기록`

남은 리스크:

- Figma MCP의 page child metadata는 실제 screenshot과 다르게 비어 있는 값으로 반환될 수 있어, 이후에도 metadata와 screenshot을 함께 확인해야 한다.
- 세부 시각 검토는 사용자가 Figma에서 직접 확인할 수 있다.

## 2026-05-27: Auth domain model과 schema 정의

상태: Done

목적:

- UI, API, DB에 의존하지 않는 사용자, 이메일 인증, refresh token 핵심 규칙을 정의한다.

변경 파일:

- `packages/domain/src/user.ts`
- `packages/domain/src/auth-schemas.ts`
- `packages/domain/src/email-verification.ts`
- `packages/domain/src/refresh-token.ts`
- `packages/domain/src/index.ts`
- `docs/adr/0003-auth-account-strategy.md`
- `docs/decisions.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- `User` model에 `loginId`, `nickname`, `email`, `passwordHash`, 생성일 snapshot 규칙을 추가했다.
- 회원가입 입력 검증을 위한 `loginId`, `nickname`, `email`, `password`, `signup` Zod schema를 추가했다.
- 이메일 인증 코드 생성, 만료, 사용 처리 규칙을 도메인 객체로 분리했다.
- refresh token snapshot, 만료, revoke 규칙을 도메인 객체로 분리했다.
- password hash 라이브러리는 MVP에서 `bcryptjs`를 사용하기로 ADR과 decisions에 기록했다.

검증:

- `npm run test -- packages/domain/src/user.test.ts packages/domain/src/auth-schemas.test.ts packages/domain/src/email-verification.test.ts packages/domain/src/refresh-token.test.ts` 통과
- `npm run test -- packages/db/src/migrate.test.ts packages/db/src/todo-repository.test.ts apps/api/src/todos/todos.module.test.ts` 통과
- `npm run check` 통과

커밋:

- `c068f12 feat(domain): Auth 도메인 규칙 추가`

남은 리스크:

- 실제 password hashing cost와 token 서명/만료 설정은 이후 application/API task에서 결정해야 한다.
- 저장 구조와 repository가 아직 없어 Auth API는 다음 task 이후 구현한다.

## 2026-05-27: Auth 저장 구조와 repository 확장

상태: Done

목적:

- 사용자, refresh token, 이메일 인증 기록을 저장하고 Todo를 사용자 소유 데이터로 분리할 DB/repository 기반을 만든다.

변경 파일:

- `packages/db/drizzle/0002_auth_storage.sql`
- `packages/db/drizzle/meta/_journal.json`
- `packages/db/src/schema.ts`
- `packages/db/src/user-repository.ts`
- `packages/db/src/refresh-token-repository.ts`
- `packages/db/src/email-verification-repository.ts`
- `packages/db/src/todo-repository.ts`
- `packages/domain/src/user-repository.ts`
- `packages/domain/src/refresh-token-repository.ts`
- `packages/domain/src/email-verification-repository.ts`
- `packages/domain/src/todo-repository.ts`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- `users`, `refresh_tokens`, `email_verifications` table과 `todos.user_id` 참조를 추가했다.
- `users.login_id`, `users.email`, `refresh_tokens.token_hash`에 unique 제약을 추가했다.
- 사용자 삭제 시 owned Todo와 refresh token은 FK cascade로 삭제되도록 했다.
- 사용자 repository 삭제 동작에서 같은 이메일의 이메일 인증 기록도 함께 삭제하도록 했다.
- 사용자, refresh token, 이메일 인증 repository 계약과 Drizzle 구현을 추가했다.
- Todo repository에 사용자별 생성, 목록 조회, 단건 조회 메서드를 추가했다.

검증:

- `npm run test -- packages/db/src/migrate.test.ts packages/db/src/todo-repository.test.ts packages/db/src/user-repository.test.ts packages/db/src/refresh-token-repository.test.ts packages/db/src/email-verification-repository.test.ts` 통과
- `npm run check` 통과

커밋:

- `fd2a284 feat(db): Auth 저장 구조와 repository 추가`

남은 리스크:

- `todos.user_id`는 기존 미인증 Todo API 검증을 깨지 않기 위해 nullable로 추가했다. Task 41에서 인증 보호와 함께 생성/조회 경로를 사용자 기준으로 전환해야 한다.
- refresh token 원문 hashing, JWT 서명, SMTP 설정은 이후 task에서 구현해야 한다.

## 2026-05-27: Nodemailer mail sender 구현

상태: Done

목적:

- 이메일 인증 코드를 실제 SMTP 메일로 발송할 수 있는 Nodemailer 기반 infrastructure를 만든다.

변경 파일:

- `apps/api/package.json`
- `package-lock.json`
- `apps/api/src/auth/application/mail-sender.ts`
- `apps/api/src/auth/infrastructure/nodemailer-mail-sender.ts`
- `apps/api/src/auth/infrastructure/smtp-mail-config.ts`
- `apps/api/src/auth/infrastructure/nodemailer-mail-sender.test.ts`
- `apps/api/src/auth/infrastructure/smtp-mail-config.test.ts`
- `docs/development-guide.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- application 계층에서 사용할 `MailSender` interface와 `MailSendFailedError`를 추가했다.
- Nodemailer transporter를 주입받아 이메일 인증 코드를 발송하는 `NodemailerMailSender`를 추가했다.
- 아이디 찾기와 비밀번호 재설정 목적별 subject와 본문을 분리했다.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` 환경변수 파서를 추가했다.
- 테스트에서는 fake transporter로 실제 SMTP 연결 없이 발송 payload와 실패 변환을 검증했다.

검증:

- `npm run test -- apps/api/src/auth/infrastructure/nodemailer-mail-sender.test.ts apps/api/src/auth/infrastructure/smtp-mail-config.test.ts` 통과
- `npm run typecheck` 통과
- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- 실제 SMTP provider 계정과 비밀값은 로컬/배포 환경에서 별도로 주입해야 한다.
- Auth API use case와 controller는 아직 mail sender를 호출하지 않는다.

## 2026-05-27: Auth API 기본 인증 흐름 구현

상태: Done

목적:

- 회원가입, 로그인, refresh, 로그아웃 API와 JWT/refresh token 기반 인증 흐름을 제공한다.

변경 파일:

- `apps/api/package.json`
- `package-lock.json`
- `apps/api/src/app.module.ts`
- `apps/api/src/auth/auth.module.ts`
- `apps/api/src/auth/auth.tokens.ts`
- `apps/api/src/auth/application/auth-use-cases.ts`
- `apps/api/src/auth/application/auth-use-case.providers.ts`
- `apps/api/src/auth/presentation/auth.controller.ts`
- `apps/api/src/auth/infrastructure/auth-database.providers.ts`
- `apps/api/src/auth/infrastructure/auth-config.ts`
- `apps/api/src/auth/infrastructure/bcrypt-password-hasher.ts`
- `apps/api/src/auth/infrastructure/jwt-access-token-issuer.ts`
- `apps/api/src/auth/infrastructure/refresh-token-hasher.ts`
- `docs/adr/0003-auth-account-strategy.md`
- `docs/decisions.md`
- `docs/development-guide.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- `POST /auth/signup`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` controller를 추가했다.
- 회원가입에서 `loginId`, `nickname`, `email`, `password`를 검증하고 bcrypt password hash를 저장한다.
- 로그인에서 access token을 응답 body로 반환하고 refresh token을 HTTP-only cookie로 설정한다.
- refresh token 원문은 SHA-256 hash로 저장하고, refresh/logout 시 hash로 조회한다.
- JWT access token 발급을 추가하고 기본 만료 시간을 15분으로 정했다.
- refresh token 기본 만료 시간을 30일로 정했다.
- `bcryptjs` 기본 cost를 `12`로 정했다.
- 요청 검증 실패는 `BadRequestException`, 인증 실패는 `UnauthorizedException`으로 변환한다.

검증:

- `npm run test -- apps/api/src/auth/application/auth-use-cases.test.ts apps/api/src/auth/presentation/auth.controller.test.ts apps/api/src/auth/infrastructure/auth-config.test.ts apps/api/src/auth/infrastructure/jwt-access-token-issuer.test.ts apps/api/src/auth/infrastructure/refresh-token-hasher.test.ts apps/api/src/auth/infrastructure/bcrypt-password-hasher.test.ts` 통과
- `npm run test -- packages/db/src/todo-repository.test.ts` 통과
- `npm run check` 재실행 통과

커밋:

- 미커밋

남은 리스크:

- Auth module과 Todo module의 DB provider는 아직 분리되어 있다. Task 41에서 Todo API 인증 보호와 사용자별 데이터 분리를 하며 DB provider 공유 구조로 정리해야 한다.
- 아이디 찾기, 비밀번호 재설정, 로그인 후 비밀번호 변경, 회원탈퇴 API는 이후 task에서 구현한다.

## 2026-05-27: 아이디 찾기와 비밀번호 재설정 API 구현

상태: Done

목적:

- 이메일 인증 기반 아이디 찾기와 비밀번호 재설정 API를 제공한다.

변경 파일:

- `apps/api/src/auth/application/auth-use-cases.ts`
- `apps/api/src/auth/application/auth-use-case.providers.ts`
- `apps/api/src/auth/application/auth-use-cases.test.ts`
- `apps/api/src/auth/presentation/auth.controller.ts`
- `apps/api/src/auth/presentation/auth.controller.test.ts`
- `apps/api/src/auth/auth.tokens.ts`
- `apps/api/src/auth/infrastructure/auth-config.ts`
- `apps/api/src/auth/infrastructure/auth-config.test.ts`
- `apps/api/src/auth/infrastructure/auth-database.providers.ts`
- `docs/development-guide.md`
- `docs/decisions.md`
- `docs/current-plan.md`
- `docs/task-log.md`

핵심 변경:

- 아이디 찾기 인증 코드 요청/확인 API를 추가했다.
- 비밀번호 재설정 인증 코드 요청/확인 API를 추가했다.
- 이메일 인증 코드는 기본 10분 동안 유효하도록 설정했다.
- 인증 코드 요청 시 `EmailVerificationRepository`에 기록하고 `MailSender`로 실제 발송 경로를 호출한다.
- 아이디 찾기 인증 성공 시 login ID를 반환한다.
- 비밀번호 재설정 인증 성공 시 password hash를 변경하고 기존 refresh token을 무효화한다.

검증:

- `npm run test -- apps/api/src/auth/application/auth-use-cases.test.ts apps/api/src/auth/presentation/auth.controller.test.ts apps/api/src/auth/infrastructure/auth-config.test.ts` 통과
- `npm run check` 통과

커밋:

- 미커밋

남은 리스크:

- 로그인 후 비밀번호 변경과 회원탈퇴 API는 아직 구현하지 않았다.
- 실제 SMTP provider 계정과 비밀값은 로컬/배포 환경에서 별도로 주입해야 한다.
