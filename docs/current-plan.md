# Current Plan

이 문서는 Agent가 현재 진행할 작업 범위를 빠르게 파악하기 위한 운영 문서다. 긴 계획과 과거 기록은 reference 문서나 `task-log.md`를 확인한다.

## 현재 상태

- Todo App MVP 구현은 완료된 샘플 프로젝트 상태다.
- 기본 검증 명령은 `npm run check`다.
- Agent Harness 정리 작업을 진행 중이다.
- Agent Harness 기준 문서, skill 업데이트, 운영 문서 추가가 완료되었다.
- `docs/agent-workflow.md`가 하네스와 운영 문서 기준에 맞게 정리되었다.
- `AGENTS.md`가 하네스와 운영 문서 우선순위를 반영하도록 정리되었다.
- README 문서 링크에 Agent Harness와 운영 문서가 추가되었다.
- Husky 기반 Git hook이 추가되었다.
- 기존 제품/설계/개발 문서는 아직 이동하거나 archive하지 않는다.

## 현재 Phase

Agent Harness 운영 문서 도입.

목표:

- `docs/agent-harness.md`를 기준 문서로 둔다.
- Agent가 기본 컨텍스트로 읽을 짧은 운영 문서를 추가한다.
- 기존 긴 문서는 reference로 유지한다.
- 이후 skill과 작업 루프 문서를 운영 문서 중심으로 정렬한다.

## 현재 Task

다음 task 승인 대기.

추천 task:

필요하면 기존 상세 문서의 archive 기준을 별도 task로 적용한다.

목표:

- 기존 상세 문서 중 archive로 보낼 문서가 있는지 판단한다.
- archive를 적용한다면 `docs/agent-harness.md`의 주제 기준 구조를 따른다.
- 현재는 기존 상세 문서를 유지하는 것이 기본 방침이다.

검증:

- `npm run check`

테스트 예외:

- 문서 정리 task이므로 Red/Green 테스트를 작성하지 않는다.

## 최근 완료 Task

Husky Git hook 도입.

완료 조건:

- `husky`가 devDependency에 추가된다.
- `prepare` script가 Husky를 초기화한다.
- `pre-commit`이 format, lint, typecheck를 실행한다.
- `pre-push`가 `npm run check`를 실행한다.
- 개발 가이드와 결정 인덱스에 hook 기준이 기록된다.

검증:

- `npm run check` 통과

테스트 예외:

- 문서 정리 task이므로 Red/Green 테스트를 작성하지 않는다.

## 다음 Task 후보

1. 필요하면 기존 상세 문서의 archive 기준을 별도 task로 적용한다.

## 중단 조건

- 기존 제품 문서의 의미를 바꿔야 하는 경우.
- 기존 문서를 archive로 이동해야 하는 경우.
- 새 자동화 도구, hook, script 도입이 필요한 경우.
