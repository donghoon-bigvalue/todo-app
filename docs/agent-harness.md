# Agent Harness

이 문서는 사용자의 아이디어를 AI Agent가 바로 구현하지 않고, 기획, 디자인, TDD 기반 개발로 이어지는 검증 가능한 작업 루프로 바꾸기 위한 하네스 기준을 정의한다.

`docs/agent-workflow.md`가 Todo App 안에서 task를 실행하는 세부 루프라면, 이 문서는 그보다 앞선 단계에서 아이디어를 어떻게 받아들이고, 어떤 문서와 승인 게이트를 거쳐 실행 가능한 계획으로 내릴지 다룬다.

## 목표

- 사용자의 자연어 아이디어를 검증 가능한 제품 초안으로 바꾼다.
- 승인되지 않은 가정을 문서나 코드로 고정하지 않는다.
- Agent가 매번 긴 문서를 전부 읽지 않아도 되도록 기본 컨텍스트를 작게 유지한다.
- 기획, Figma 디자인, TDD 개발을 한 번에 섞지 않고 순서가 있는 작업 루프로 연결한다.
- 다음 프로젝트에서도 재사용 가능한 Agent 운영 기준을 만든다.

## 기본 원칙

- Agent는 사용자의 아이디어를 바로 구현하지 않는다.
- 먼저 채팅에서 제품 초안을 제시한다.
- 초안은 확정안이 아니라 수정 가능한 가정 목록으로 작성한다.
- 사용자가 초안을 승인하기 전에는 문서 파일을 만들거나 수정하지 않는다.
- 승인된 초안만 제품 문서와 implementation plan으로 내린다.
- 한 번에 하나의 task만 실행한다.
- 새 phase, 새 기술 결정, 새 도구 도입, 커밋, 푸시는 명시적인 승인 게이트를 둔다.

## Idea Intake

Idea Intake는 초안 우선형으로 진행한다.

사용자가 만들고 싶은 것을 자연어로 말하면 Agent는 먼저 다음 형식의 제품 초안을 제시한다.

```text
## 이해한 목표

## 대상 사용자

## MVP 범위

## 제외 범위

## 핵심 사용자 흐름

## 성공 기준

## 열린 질문

## 다음 단계 제안
```

초안 작성 기준:

- 사용자의 표현에서 확실한 내용과 Agent의 추정을 구분한다.
- MVP 범위는 작고 검증 가능한 기능으로 제한한다.
- 제외 범위는 초기에 명확히 적어 scope creep을 줄인다.
- 열린 질문은 다음 계획을 막는 질문 위주로 제한한다.
- 다음 단계 제안은 문서화 또는 추가 논의 중 하나로 끝낸다.

사용자는 초안에 대해 다음 중 하나를 선택할 수 있다.

- 승인한다.
- 일부 항목을 수정한다.
- 다른 방향으로 다시 만들어 달라고 요청한다.
- 더 논의한 뒤 결정한다.

## 채팅 승인 후 문서화

초안 단계에서는 파일을 만들지 않는다.

사용자가 초안을 승인하면 Agent는 승인된 내용을 기준으로 필요한 문서를 작성한다. 초안에서 바뀐 내용은 채팅에서 먼저 확인하고, 확인된 내용만 문서에 반영한다.

기본 문서 세트:

```text
docs/product-brief.md
docs/requirements.md
docs/user-flow.md
docs/design-brief.md
docs/implementation-plan.md
```

필요할 때만 추가하는 문서:

```text
docs/figma-plan.md
docs/development-guide.md
docs/adr/*
```

추가 문서 작성 기준:

- Figma에서 직접 작업할 화면과 컴포넌트 기준이 필요하면 `figma-plan.md`를 만든다.
- 실행, 테스트, 배포, 로컬 환경 기준이 필요하면 `development-guide.md`를 만든다.
- 기술 스택, 아키텍처, 도구 도입처럼 장기 영향이 있는 결정을 하면 `docs/adr/`에 남긴다.

## UI 영향도 판정

문서화 이후 implementation plan을 만들 때 Agent는 먼저 UI 영향도를 판정한다.

UI 영향이 있는 경우:

- 새 화면이 생긴다.
- 새 컴포넌트가 생긴다.
- 기존 컴포넌트에 새 상태나 variant가 생긴다.
- 사용자 입력 방식이나 주요 interaction이 바뀐다.
- 목록, form, navigation, modal, panel 등 화면 구조가 바뀐다.
- Figma Components 또는 Screens 기준과 코드 구현이 달라질 수 있다.

UI 영향이 없으면 domain, API, DB, refactor 같은 구현 task부터 진행할 수 있다.

UI 영향이 있으면 코드 구현보다 먼저 다음 순서를 따른다.

```text
design-brief 갱신
-> figma-plan 갱신 또는 작성
-> Figma Components/Screens 업데이트 task
-> Figma metadata 또는 screenshot 검증
-> 코드 디자인 시스템 또는 UI 구현 task
-> 기능 연결 task
```

implementation plan에는 Figma 작업 task를 코드 구현 task보다 먼저 둔다. Figma 작업 없이 코드부터 구현하려면 사용자의 명시적인 승인이 필요하다.

## 실행 루프

문서화 이후 실제 task 실행은 `docs/agent-workflow.md`와 `.codex/skills/agent-work-loop/SKILL.md`를 따른다.

기본 흐름:

```text
Context Intake
-> Task Planning
-> Red
-> Green
-> Refactor
-> Verify
-> Record
```

문서 작업이나 초기 bootstrap처럼 테스트가 자연스럽지 않은 작업은 테스트 예외 사유를 보고에 남긴다.

## 승인 게이트

다음 상황에서는 Agent가 멈추고 사용자 확인을 받는다.

- 제품 초안을 문서화할 때
- 새 phase로 넘어갈 때
- 현재 plan에 없는 큰 작업을 시작할 때
- MVP 범위나 제외 범위를 바꿀 때
- 기술 스택 또는 아키텍처 결정을 바꿀 때
- 새 라이브러리, 프레임워크, MCP, hook, skill을 도입할 때
- Figma 디자인 기준을 바꿀 때
- UI 영향이 있는데 Figma 작업을 건너뛰고 코드부터 구현하려 할 때
- 검증 실패 상태에서 작업을 계속할지 결정해야 할 때
- 커밋할 때
- 푸시할 때

승인 없이 계속 진행할 수 있는 경우:

- 승인된 task 안에서 테스트를 작성하고 최소 구현을 진행할 때
- 같은 task 안에서 실패한 검증을 고치기 위해 필요한 작은 수정을 할 때
- 사용자 요청 범위 안에서 문서의 오탈자나 명확성 문제를 정리할 때

## 컨텍스트 관리

Agent는 모든 `docs/` 문서를 매번 읽지 않는다.

항상 읽는 문서는 짧고 안정적인 운영 문서로 제한한다. 긴 문서는 reference로 두고, 현재 task와 관련 있을 때만 읽는다.

목표 운영 문서:

```text
docs/project-brief.md
docs/current-plan.md
docs/decisions.md
docs/task-log.md
```

역할:

- `project-brief.md`: 제품 목표, MVP, 제외 범위, 성공 기준을 짧게 요약한다.
- `current-plan.md`: 현재 phase, 현재 task, 다음 task 후보, 검증 기준만 담는다.
- `decisions.md`: ADR과 주요 제품 결정을 요약하고 원문 링크를 제공한다.
- `task-log.md`: 완료된 task, 검증 결과, 커밋, 남은 리스크를 누적한다.

현재 Todo App은 기존 문서를 유지한 상태에서 위 운영 문서를 점진적으로 도입한다. 기존 문서를 즉시 이동하거나 이름을 바꾸지 않는다.

## Archive 기준

Archive는 기본적으로 날짜가 아니라 주제 기준으로 정리한다.

권장 구조:

```text
docs/archive/
  product/
  design/
  engineering/
  adr/
  snapshots/
```

일반 문서는 주제별 디렉터리에 보관하고, 날짜는 문서 상단 metadata에 기록한다.

예시:

```md
---
status: archived
created: 2026-05-14
archived: 2026-05-20
superseded_by: ../project-brief.md
---
```

특정 시점의 전체 상태를 보존해야 할 때만 snapshot을 사용한다.

```text
docs/archive/snapshots/2026-05-14-phase-1-complete/
```

## 완료 기준

하네스가 잘 작동하는지는 다음 기준으로 확인한다.

- Agent가 사용자의 아이디어를 바로 코드로 바꾸지 않는다.
- 먼저 제품 초안을 만들고 사용자 승인을 받는다.
- 승인된 초안만 문서에 반영한다.
- task는 하나씩 진행한다.
- 각 task는 목적, 완료 조건, 검증 방법을 가진다.
- 기능 구현은 TDD 흐름을 따른다.
- 검증 실패 상태에서는 커밋하지 않는다.
- 다음 task를 제안하되 사용자 승인 없이 새 phase로 넘어가지 않는다.
- 긴 문서는 기본 컨텍스트에 넣지 않고 필요할 때만 읽는다.
