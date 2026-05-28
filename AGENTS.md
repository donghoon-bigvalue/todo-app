# Agent 작업 지침

이 문서는 AI Agent가 이 저장소에서 작업할 때 따를 기본 규칙을 정의한다.

## 기본 원칙

- 작업은 작은 단위로 나누고, 각 변경은 검증 가능한 상태로 마무리한다.
- 사용자의 요청 범위를 벗어난 기능이나 도구를 임의로 추가하지 않는다.
- 제품 의사결정은 `docs/` 아래 문서에 남기고, 코드 변경은 해당 결정과 일관되게 진행한다.
- 구현보다 기획, 요구사항, 검증 기준을 먼저 확인한다.

## 언어 사용 규칙

이 프로젝트의 기본 작업 언어는 한국어다. 세부 기준은 로컬 skill 문서를 따른다.

- `.codex/skills/korean-working-language/SKILL.md`

## 커밋 메시지 규칙

커밋 메시지는 Conventional Commits 형식을 따르되, 설명은 한국어로 작성한다. 세부 기준은 로컬 skill 문서를 따른다.

- `.codex/skills/git-conventional-commits/SKILL.md`

## 작업 순서

기능을 구현할 때는 다음 순서를 기본으로 한다.

1. 요구사항과 제외 범위를 확인한다.
2. 검증 가능한 인수 조건을 정리한다.
3. 필요한 테스트를 먼저 작성하거나, 테스트하지 않는 이유를 설명한다.
4. 최소 구현을 진행한다.
5. 관련 검증 명령을 실행한다.
6. 변경 내용, 검증 결과, 남은 리스크를 한국어로 요약한다.

## 작업 루프 규칙

채팅으로 들어온 아이디어를 바로 구현하지 않고, 먼저 제품 초안, 작업 단위, 검증 기준으로 정리한다.

- 새 아이디어를 제품 초안으로 정리하고 승인받는 기준은 `docs/agent-harness.md`를 따른다.
- 기본 컨텍스트는 `docs/project-brief.md`, `docs/current-plan.md`, `docs/decisions.md`, `docs/task-log.md`를 우선한다.
- 전체 구현 순서는 `docs/current-plan.md`를 우선 확인하고, 필요한 경우 `docs/implementation-plan.md`를 참고한다.
- Agent의 반복 작업 방식은 `docs/agent-workflow.md`를 따른다.
- 실제 작업을 진행할 때는 `.codex/skills/agent-work-loop/SKILL.md`를 참고한다.
- 한 번에 하나의 task만 진행하고, 사용자의 승인 없이 다음 phase로 넘어가지 않는다.
- 사용자가 제품 초안을 승인하기 전에는 문서 파일을 만들거나 수정하지 않는다.
- 각 task는 검증을 통과한 뒤 하나의 커밋으로 기록한다.
- 사용자가 논의를 요청한 경우에는 구현하지 않고 선택지, 추천안, 다음 task 후보를 제시한다.
- 사용자가 커밋 보류를 요청한 경우에는 커밋하지 않는다.
- 푸시는 사용자가 요청했을 때만 수행한다.

## 실행 서버 정리 규칙

- Agent가 task 검증을 위해 dev server나 watch process를 실행한 경우, 완료 보고 전에 종료한다.
- 사용자가 직접 확인할 수 있도록 서버를 유지해야 하면 완료 보고에 실행 중인 URL과 종료하지 않은 이유를 명시한다.
- 종료 대상은 Agent가 해당 task에서 직접 실행한 세션으로 제한한다.
- 기존에 떠 있던 서버나 사용자가 실행한 프로세스는 임의로 종료하지 않는다.

## 문서 작성 규칙

- 문서는 독자가 현재 맥락을 모른다고 가정하고 작성한다.
- 제품 문서에는 제품 관점의 내용만 담고, 개발 운영 규칙은 이 문서나 별도 개발 문서에 둔다.
- 모든 `docs/` 문서를 매번 기본 컨텍스트로 읽지 않는다.
- 긴 제품 문서와 ADR은 현재 task와 직접 관련될 때만 reference로 확인한다.
- 현재 상태와 다음 task가 바뀌면 `docs/current-plan.md`를 갱신한다.
- 완료된 task 기록이 필요하면 `docs/task-log.md`에 남긴다.
- 아직 결정되지 않은 내용은 확정처럼 쓰지 않고, 열린 질문으로 남긴다.
- 불필요하게 많은 기능을 제안하지 않고, MVP 범위를 우선한다.

## 도구 도입 규칙

- 새 라이브러리, 프레임워크, MCP, hook, skill은 필요성이 드러난 뒤 도입한다.
- 반복 작업이 3번 이상 발생하면 자동화 후보로 기록한다.
- 기계적으로 검증 가능한 규칙은 hook 후보로 본다.
- 여러 프로젝트에서 재사용 가능한 절차는 skill 후보로 본다.

## Figma 작업 규칙

Figma 파일을 생성, 수정, 검토할 때는 로컬 skill 문서를 따른다.

- `.codex/skills/figma-design-sync/SKILL.md`

Figma에서 새 section, component group, screen group, 화면 frame을 추가하거나 이동할 때는 기존 sibling node와의 배치 충돌 검사를 필수로 한다.

- 쓰기 전 같은 page 또는 같은 section의 주요 sibling node 좌표와 크기를 확인한다.
- 기존 row/column 간격을 따라 다음 slot에 배치한다.
- 기존 간격을 알 수 없으면 screen frame 사이 최소 `40px`, 큰 section 사이 최소 `80px` gutter를 둔다.
- page title 또는 page intro frame 아래 첫 content section은 title frame 하단과 최소 `56px` 이상 떨어뜨린다.
- 쓰기 후 `get_metadata`로 이동한 node의 좌표와 크기를 다시 확인한다.
- sibling bounding box와 겹치거나 기준 row에서 벗어난 상태면 완료로 보고하지 않는다.

## UI 구현과 Figma 정합성 규칙

새 화면, 새 컴포넌트, 새 form 상태, 새 navigation, 기존 화면의 시각적 변경이 포함된 코드 작업은 Figma 기준 확인을 작업 착수 조건으로 본다.

- 이미 Figma 화면이나 컴포넌트가 있는 경우, 코드 구현 전에 해당 Figma URL 또는 node id를 확인한다.
- `get_design_context`, `get_metadata`, `get_screenshot` 중 현재 작업에 필요한 최소 read-only 확인을 먼저 수행한다.
- 작업 계획 또는 중간 보고에 참고한 Figma node와 코드 화면의 대응 관계를 남긴다.
- Figma 기준과 다르게 구현할 필요가 있으면 코드 작성 전에 이유와 차이를 사용자에게 설명한다.
- Figma 확인 없이 UI 구현을 진행해야 하는 경우에는 사용자에게 먼저 명시적으로 확인받는다.
- UI 작업 완료 보고에는 참고한 Figma URL/node id, 구현한 화면과 Figma 화면의 대응 관계, 의도적으로 다르게 만든 부분, 실행한 검증을 포함한다.
- 위 항목이 없으면 UI task는 완료로 보지 않는다.

## 구현 작업 규칙

기능 구현, 버그 수정, 리팩터링을 할 때는 TDD와 클린 아키텍처 로컬 skill 문서를 따른다.

- `.codex/skills/tdd-clean-architecture/SKILL.md`

Figma 컴포넌트를 코드 디자인 시스템으로 옮기거나 showcase 페이지를 수정할 때는 디자인 시스템 showcase 로컬 skill 문서를 따른다.

- `.codex/skills/design-system-showcase/SKILL.md`

## 완료 보고 규칙

작업을 마칠 때는 다음을 포함한다.

- 변경한 파일
- 핵심 변경 내용
- 실행한 검증
- 실행하지 못한 검증과 이유
- 다음에 이어서 할 수 있는 작업
