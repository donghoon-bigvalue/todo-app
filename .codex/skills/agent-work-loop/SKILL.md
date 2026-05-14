---
name: agent-work-loop
description: Use in this Todo App project when turning chat ideas into product drafts and implementation tasks, applying docs/agent-harness.md, selecting the next task from docs/implementation-plan.md or docs/current-plan.md, planning one task, enforcing approval gates, applying TDD and clean architecture gates, verifying work, reporting outcomes, or deciding whether to commit or push.
---

# Agent Work Loop

이 skill은 Todo App에서 AI Agent가 작업을 작은 단위로 계획하고 실행할 때 사용한다.

목표는 빠르게 많이 구현하는 것이 아니라, 사용자의 제약조건을 지키면서 검증 가능한 한 task를 끝내는 것이다.

## 시작 전 확인

작업 전에 다음을 확인한다.

- `AGENTS.md`
- `docs/agent-harness.md`
- `docs/implementation-plan.md`
- `docs/agent-workflow.md`
- 존재한다면 `docs/project-brief.md`, `docs/current-plan.md`, `docs/decisions.md`, `docs/task-log.md`
- 관련 제품 문서와 ADR
- 현재 git 상태

모든 `docs/` 문서를 매번 읽지 않는다. 먼저 하네스와 현재 task에 필요한 운영 문서를 읽고, 긴 제품 문서와 ADR은 현재 작업에 직접 관련될 때만 추가로 확인한다.

사용자가 논의를 요청했으면 구현하지 말고 선택지, 추천안, 다음 task 후보를 제시한다.

사용자가 새 아이디어를 말했지만 아직 승인된 제품 초안이 없으면 구현이나 문서 작성을 하지 않는다. 먼저 `docs/agent-harness.md`의 Idea Intake 형식에 따라 채팅에서 제품 초안을 제시한다.

사용자가 진행을 요청했으면 승인된 범위 안에서 하나의 task만 실행한다.

## Idea Intake

새 제품이나 큰 기능 아이디어를 받으면 초안 우선형으로 진행한다.

채팅에서 먼저 다음 항목을 정리한다.

- 이해한 목표
- 대상 사용자
- MVP 범위
- 제외 범위
- 핵심 사용자 흐름
- 성공 기준
- 열린 질문
- 다음 단계 제안

초안은 확정안이 아니라 수정 가능한 가정 목록으로 작성한다. 사용자의 표현에서 확실한 내용과 Agent의 추정을 구분한다.

사용자가 초안을 승인하기 전에는 문서 파일을 만들거나 수정하지 않는다. 사용자가 승인하면 그때 승인된 초안을 기준으로 제품 문서와 implementation plan을 작성한다.

## Task 선택

다음 기준으로 task를 고른다.

1. 사용자가 명시한 작업
2. `docs/current-plan.md`가 있으면 현재 phase와 다음 task
3. `docs/implementation-plan.md`의 다음 미진행 task
4. 현재 막힌 작업을 해소하는 가장 작은 선행 task

선택한 task에 대해 실행 전 짧게 정리한다.

- 목표
- 변경 예상 파일
- UI 영향 여부와 Figma 선행 작업 필요 여부
- 테스트 전략
- 검증 명령
- 범위 밖 항목

범위가 모호하면 먼저 묻는다.

새 화면, 새 컴포넌트, 기존 컴포넌트의 새 상태나 variant, 새 interaction이 생기면 코드 구현 전에 Figma 작업 task가 있는지 확인한다. 없으면 `docs/agent-harness.md`의 UI 영향도 판정 기준에 따라 Figma 작업을 먼저 제안한다.

## 실행 루프

기능 구현과 동작 변경은 다음 순서를 따른다.

1. Red: 실패하는 테스트를 먼저 작성한다.
2. Green: 테스트를 통과시키는 최소 구현을 한다.
3. Refactor: 중복과 경계를 정리한다.
4. Verify: 관련 검증 명령을 실행한다.
5. Record: 변경 내용, 검증 결과, 남은 리스크, 다음 task 후보를 남긴다.

문서 작업이나 초기 bootstrap처럼 테스트가 자연스럽지 않은 작업은 테스트 예외 사유를 보고에 남긴다.

## 실행 서버 정리

- Verify 단계에서 dev server나 watch process를 실행했다면 Record 전에 종료한다.
- 사용자가 직접 확인해야 해서 서버를 유지하는 경우, 완료 보고에 URL과 유지 이유를 명시한다.
- 종료 대상은 이 task에서 Agent가 직접 실행한 세션으로 제한한다.
- 기존에 떠 있던 서버나 사용자가 실행한 프로세스는 임의로 종료하지 않는다.

## 경계 규칙

- 한 번에 하나의 task만 진행한다.
- 사용자 승인 없이 다음 phase로 넘어가지 않는다.
- 사용자 승인 없이 제품 초안을 문서화하지 않는다.
- 승인되지 않은 가정을 코드나 문서에 확정처럼 반영하지 않는다.
- 요청 범위 밖 기능을 추가하지 않는다.
- 새 라이브러리, MCP, hook, skill은 사용자 승인 또는 문서화된 결정 없이 추가하지 않는다.
- MVP 범위, 제외 범위, 기술 스택, 아키텍처, Figma 기준을 바꾸려면 먼저 사용자 확인을 받는다.
- UI 영향이 있는데 Figma 작업을 건너뛰고 코드부터 구현하려면 먼저 사용자 확인을 받는다.
- TDD와 클린 아키텍처 작업은 `tdd-clean-architecture` skill을 함께 따른다.
- Figma 관련 작업은 `figma-design-sync` skill을 함께 따른다.
- Figma 컴포넌트를 코드로 옮기거나 `/showcase`를 수정하면 `design-system-showcase` skill을 함께 따른다.

## 커밋과 푸시

- 각 task는 완료 후 검증을 통과하면 하나의 커밋으로 기록한다.
- 커밋은 task의 완료 기록이며, 다음 task로 넘어가기 전에 수행한다.
- 사용자가 커밋 보류를 요청한 경우에는 커밋하지 않는다.
- 푸시는 사용자가 요청했을 때만 수행한다.
- 커밋 전에는 변경 범위와 검증 결과를 확인한다.
- 커밋 메시지는 `git-conventional-commits` skill을 따른다.
- 검증 실패 상태에서는 커밋하지 않는다. 단, 사용자가 실패 상태를 기록하라고 명시하면 예외로 한다.

## 완료 보고

완료 보고에는 다음을 포함한다.

- 변경한 파일
- 핵심 변경 내용
- 실행한 검증
- 실행하지 못한 검증과 이유
- 다음에 논의할 task 후보
