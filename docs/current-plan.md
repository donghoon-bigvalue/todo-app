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
- Todo 메모 기능 초안이 승인되어 제품 문서와 구현 계획에 반영되었다.
- 기존 제품/설계/개발 문서는 아직 이동하거나 archive하지 않는다.

## 현재 Phase

Todo 메모 확장.

목표:

- 생성된 할 일에 선택 메모를 추가, 수정, 비울 수 있게 한다.
- 할 일 생성 form은 기존처럼 title만 입력한다.
- 목록에서는 메모가 있는 항목만 제목 아래에 2줄까지 표시한다.
- 메모 편집은 한 번에 하나의 Todo에서만 열린다.

## 현재 Task

다음 task 승인 대기.

추천 task:

Task 27: Todo note Figma 디자인 업데이트.

목표:

- 메모가 있는 Todo Item과 메모 편집 상태를 Figma 기준으로 먼저 정의한다.
- 메모 버튼, textarea, 저장/취소 버튼 배치를 정한다.
- 대표 노드 metadata로 정렬과 크기를 검증한다.

검증:

- Figma metadata 확인
- 필요 시 screenshot 확인

테스트 예외:

- Figma 디자인 task이므로 Red/Green 테스트를 작성하지 않는다.

## 최근 완료 Task

Todo 메모 기능 문서화.

완료 조건:

- 승인된 메모 UX가 제품 문서에 반영된다.
- 요구사항과 사용자 흐름에 메모 추가, 수정, 비우기가 정의된다.
- 디자인 브리프에 메모 표시와 인라인 편집 상태가 반영된다.
- 구현 계획에 Todo 메모 확장 phase와 Figma 선행 task가 추가된다.

검증:

- `npm run check` 통과

테스트 예외:

- 이번 task는 문서화 작업이므로 Red/Green 테스트를 작성하지 않는다.

## 다음 Task 후보

1. Task 27: Todo note Figma 디자인 업데이트
2. Task 28: Todo note domain과 schema 확장
3. Task 29: Todo note 저장 구조와 repository 확장
4. Task 30: Todo note use case와 API 확장
5. Task 31: Todo Item note UI와 showcase 확장
6. Task 32: Todo note 편집 기능 연결
7. Task 33: Todo note E2E 확장

## 중단 조건

- 메모 UX를 인라인 편집이 아닌 모달이나 상세 페이지로 바꿔야 하는 경우.
- note 길이 제한이나 저장 정책을 바꿔야 하는 경우.
- 새 라이브러리나 새 UI 패턴 도입이 필요한 경우.
