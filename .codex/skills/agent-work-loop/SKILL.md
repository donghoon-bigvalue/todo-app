---
name: agent-work-loop
description: Use in this Todo App project when turning chat ideas into implementation tasks, selecting the next task from docs/implementation-plan.md, planning work, enforcing one-task-at-a-time execution, applying TDD and clean architecture gates, verifying work, reporting outcomes, or deciding whether to commit or push.
---

# Agent Work Loop

이 skill은 Todo App에서 AI Agent가 작업을 작은 단위로 계획하고 실행할 때 사용한다.

목표는 빠르게 많이 구현하는 것이 아니라, 사용자의 제약조건을 지키면서 검증 가능한 한 task를 끝내는 것이다.

## 시작 전 확인

작업 전에 다음을 확인한다.

- `AGENTS.md`
- `docs/implementation-plan.md`
- `docs/agent-workflow.md`
- 관련 제품 문서와 ADR
- 현재 git 상태

사용자가 논의를 요청했으면 구현하지 말고 선택지, 추천안, 다음 task 후보를 제시한다.

사용자가 진행을 요청했으면 승인된 범위 안에서 하나의 task만 실행한다.

## Task 선택

다음 기준으로 task를 고른다.

1. 사용자가 명시한 작업
2. `docs/implementation-plan.md`의 다음 미진행 task
3. 현재 막힌 작업을 해소하는 가장 작은 선행 task

선택한 task에 대해 실행 전 짧게 정리한다.

- 목표
- 변경 예상 파일
- 테스트 전략
- 검증 명령
- 범위 밖 항목

범위가 모호하면 먼저 묻는다.

## 실행 루프

기능 구현과 동작 변경은 다음 순서를 따른다.

1. Red: 실패하는 테스트를 먼저 작성한다.
2. Green: 테스트를 통과시키는 최소 구현을 한다.
3. Refactor: 중복과 경계를 정리한다.
4. Verify: 관련 검증 명령을 실행한다.
5. Record: 변경 내용, 검증 결과, 남은 리스크, 다음 task 후보를 남긴다.

문서 작업이나 초기 bootstrap처럼 테스트가 자연스럽지 않은 작업은 테스트 예외 사유를 보고에 남긴다.

## 경계 규칙

- 한 번에 하나의 task만 진행한다.
- 사용자 승인 없이 다음 phase로 넘어가지 않는다.
- 요청 범위 밖 기능을 추가하지 않는다.
- 새 라이브러리, MCP, hook, skill은 사용자 승인 또는 문서화된 결정 없이 추가하지 않는다.
- TDD와 클린 아키텍처 작업은 `tdd-clean-architecture` skill을 함께 따른다.
- Figma 관련 작업은 `figma-design-sync` skill을 함께 따른다.
- Figma 컴포넌트를 코드로 옮기거나 `/showcase`를 수정하면 `design-system-showcase` skill을 함께 따른다.

## 커밋과 푸시

- 커밋은 사용자가 요청했을 때만 수행한다.
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
