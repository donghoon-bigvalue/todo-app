# Agent 작업 루프

이 문서는 Todo App에서 AI Agent가 승인된 작업을 정해진 제약 안에서 실행하기 위한 세부 작업 루프를 정의한다.

사용자의 새 아이디어를 제품 초안으로 정리하고, 채팅 승인 후 문서화하는 앞단 하네스 기준은 `docs/agent-harness.md`를 따른다. 이 문서는 승인된 제품 초안이나 승인된 task가 생긴 뒤 실제 작업을 어떻게 진행할지에 집중한다.

## 목표

- 승인된 작업을 바로 코드로 옮기기 전에 작업 단위와 검증 기준으로 정리한다.
- 한 번에 하나의 task만 수행한다.
- TDD, 클린 아키텍처, Figma 디자인 시스템, git convention을 반복 가능하게 적용한다.
- 작업이 끝날 때 다음에 무엇을 논의할지 명확히 남긴다.

## 기본 루프

### 1. Context Intake

작업을 시작하기 전에 관련 맥락을 확인한다.

- `AGENTS.md`
- `docs/agent-harness.md`
- `docs/project-brief.md`
- `docs/current-plan.md`
- `docs/decisions.md`
- `docs/task-log.md`
- 관련 로컬 skill
- 현재 git 상태

`docs/implementation-plan.md`, 상세 제품 문서, 상세 ADR은 현재 task와 직접 관련될 때만 추가로 확인한다. Agent는 모든 `docs/` 문서를 매번 읽지 않는다.

사용자가 “논의해보자”, “어떻게 할까”처럼 방향을 묻는 경우에는 구현하지 않고 선택지와 추천안을 제시한다.

사용자가 새 아이디어를 말했지만 승인된 제품 초안이 없다면 이 문서의 실행 루프로 들어가지 않는다. 먼저 `docs/agent-harness.md`의 Idea Intake 절차를 따른다.

### 2. Task Planning

작업을 실행하기 전 다음을 짧게 정리한다.

- 이번 task의 목표
- 변경이 예상되는 파일
- UI 영향 여부와 Figma 선행 작업 필요 여부
- 먼저 작성할 테스트 또는 테스트하지 않는 이유
- 완료 후 실행할 검증 명령
- 범위 밖으로 남길 항목

UI 작업이면 `docs/ui-task-checklist.md`의 Preflight와 Task Template을 사용한다.

범위가 모호하거나 새 의사결정이 필요하면 사용자에게 먼저 묻는다.

새 화면, 새 컴포넌트, 새 UI 상태, 새 interaction이 생기는 task는 코드 구현 전에 Figma 작업 task가 plan에 있는지 확인한다. Figma 작업이 없으면 `docs/agent-harness.md`의 UI 영향도 판정 기준에 따라 먼저 Figma task를 제안한다.

Figma `Components` 페이지에 새 컴포넌트, component group, variant, form control, reusable action이 생기거나 기존 컴포넌트 상태가 확장되면 실제 화면 구현 전에 디자인 시스템 반영을 먼저 완료한다.

- `apps/web/src/shared/ui`에 대응 컴포넌트 또는 variant를 만든다.
- `/showcase`에 상태별 예시와 실제 화면에서 쓰는 조합을 추가한다.
- 실제 화면은 showcase에 등록한 shared UI 컴포넌트를 재사용한다.
- 검증에는 component test와 showcase 노출 검증을 포함한다.
- 이 게이트를 통과하지 못한 UI task는 완료로 기록하지 않는다.

### 3. Red

기능 구현 또는 동작 변경은 실패하는 테스트를 먼저 작성한다.

예외:

- 문서만 수정하는 작업
- 설정 파일의 매우 작은 정리
- 테스트 인프라가 아직 없는 초기 bootstrap 작업

예외를 적용하면 완료 보고에 이유를 남긴다.

### 4. Green

테스트를 통과시키는 최소 구현을 한다.

- 요청 범위를 넘는 리팩터링을 하지 않는다.
- 도메인, 애플리케이션, 인프라, 프레젠테이션 경계를 흐리지 않는다.
- 새 라이브러리는 ADR 또는 사용자 승인 없이 추가하지 않는다.

### 5. Refactor

동작을 유지하면서 구조를 정리한다.

- 중복이 실제로 드러난 경우에만 추상화한다.
- 테스트가 없는 큰 구조 변경은 피한다.
- 사용자 변경으로 보이는 파일은 되돌리지 않는다.

### 6. Verify

작업 범위에 맞는 검증을 실행한다.

예상 검증:

- unit/component/integration test
- typecheck
- lint/format
- build
- Playwright E2E

검증이 실패하면 실패 내용을 먼저 보고하고, 커밋하지 않는다.

### 7. Record

작업 완료 후 다음을 남긴다.

- 변경한 파일
- 핵심 변경 내용
- 실행한 검증
- 실행하지 못한 검증과 이유
- 남은 리스크
- 다음 task 후보

UI 작업이면 `docs/ui-task-checklist.md`의 완료 전 Audit을 통과했는지 확인하고, 참고한 Figma node, showcase 반영 여부, shared UI 재사용 여부를 기록한다.

문서 변경이 필요한 결정이 생겼다면 코드만 바꾸지 않고 관련 문서도 업데이트한다.

작업 기록은 필요하면 `docs/task-log.md`에 남기고, 다음 작업 후보나 현재 phase가 바뀌면 `docs/current-plan.md`를 갱신한다.

## 승인 게이트

다음 상황에서는 멈추고 사용자 확인을 받는다.

- 제품 초안을 문서화할 때
- 새 phase로 넘어갈 때
- `docs/current-plan.md`나 `docs/implementation-plan.md`에 없는 큰 작업을 시작할 때
- MVP 범위나 제외 범위를 바꿀 때
- 기술 스택 또는 아키텍처 결정을 바꿀 때
- Figma 디자인 기준을 바꿀 때
- UI 영향이 있는데 Figma 작업을 건너뛰고 코드부터 구현하려 할 때
- 새 라이브러리, MCP, hook, skill을 추가할 때
- 검증 실패 상태에서 계속 진행할지 결정해야 할 때
- 커밋 또는 푸시를 수행할 때

## 커밋과 푸시

- 각 task는 완료 후 검증을 통과하면 하나의 커밋으로 기록한다.
- 커밋은 task의 완료 기록이며, 다음 task로 넘어가기 전에 수행한다.
- 사용자가 커밋 보류를 요청한 경우에는 커밋하지 않는다.
- 푸시는 사용자가 요청했을 때만 수행한다.
- 커밋 전에는 `git status`로 변경 범위를 확인한다.
- 커밋 메시지는 `.codex/skills/git-conventional-commits/SKILL.md`를 따른다.
- 검증 실패 상태에서는 커밋하지 않는다. 단, 사용자가 실패 상태 기록을 명시적으로 원하면 예외로 한다.

## Skill 선택 기준

- 일반 구현, 버그 수정, 리팩터링: `.codex/skills/tdd-clean-architecture/SKILL.md`
- Figma 작업: `.codex/skills/figma-design-sync/SKILL.md`
- Figma 컴포넌트를 코드로 옮기거나 `/showcase` 수정: `.codex/skills/design-system-showcase/SKILL.md`
- 한국어 문서와 보고: `.codex/skills/korean-working-language/SKILL.md`
- 커밋 메시지 작성: `.codex/skills/git-conventional-commits/SKILL.md`
- 작업 루프 운영: `.codex/skills/agent-work-loop/SKILL.md`

여러 skill이 필요하면 최소 조합만 사용하고, 어떤 skill을 사용하는지 짧게 알린다.

## 중단 조건

다음 조건에 해당하면 무리해서 진행하지 않는다.

- 요구사항이 서로 충돌한다.
- 테스트 또는 실행 환경이 준비되지 않아 검증할 수 없다.
- Figma와 코드 기준이 서로 달라 어느 쪽을 기준으로 삼을지 결정이 필요하다.
- 사용자의 의도와 다르게 작업 범위가 커졌다.

중단할 때는 현재까지 확인한 사실, 막힌 이유, 가능한 다음 선택지를 한국어로 정리한다.
