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
- Todo note Figma 디자인 업데이트가 완료되었다.
- Todo note domain과 schema 확장이 완료되었다.
- Todo note 저장 구조와 repository 확장이 완료되었다.
- Todo note use case와 API 확장이 완료되었다.
- Todo Item note UI와 showcase 확장이 완료되었다.
- Todo note 편집 기능 연결이 완료되었다.
- Todo note E2E 확장이 완료되었다.
- Auth와 계정 관리 확장 초안이 승인되었다.
- Auth 기능 제품 문서화가 완료되었다.
- Figma 파일 참조가 복원된 파일로 갱신되었다.
- Figma 작업 안전 규칙과 기존 스타일 유지 규칙이 보강되었다.
- Auth Figma 디자인 업데이트가 완료되었다.
- Auth domain model과 schema 정의가 완료되었다.
- Auth 저장 구조와 repository 확장이 완료되었다.
- Nodemailer mail sender 구현이 완료되었다.
- Auth API 기본 인증 흐름 구현이 완료되었다.
- 아이디 찾기와 비밀번호 재설정 API 구현이 완료되었다.
- Todo API 인증 보호와 사용자별 데이터 분리가 완료되었다.
- Web Auth 화면과 token 흐름 연결이 완료되었다.
- 로그인 후 비밀번호 변경과 회원탈퇴 API 구현이 완료되었다.
- Web 계정 복구와 계정 관리 화면 연결이 완료되었다.
- Auth E2E 확장이 완료되었다.
- Auth와 계정 관리 확장 phase 정리가 완료되었다.
- Auth Web 화면의 Figma 정합성 보정이 완료되었다.
- Auth/Todo 화면의 1차 UX 보정이 완료되었다.
- Figma Auth section 배치와 겹침 방지 규칙 보강이 완료되었다.
- Figma Components page title과 첫 section 간격 보정이 완료되었다.
- Auth 입력 placeholder와 비밀번호 표시 토글의 Figma 정합성 보정이 완료되었다.
- 아이디 찾기와 비밀번호 재설정 인증 화면의 로그인 복귀 UX 보강이 완료되었다.
- Auth Form Controls의 shared UI와 showcase 수습이 완료되었다.
- UI task 체크리스트와 완료 전 Audit 문서화가 완료되었다.
- 기존 제품/설계/개발 문서는 아직 이동하거나 archive하지 않는다.

## 현재 Phase

Auth와 계정 관리 확장 완료.

목표:

- 로그인 ID, 닉네임, 이메일, 비밀번호 기반 회원가입을 제공한다.
- JWT access token과 HTTP-only cookie refresh token 기반 로그인을 제공한다.
- 실제 메일 발송 기반 이메일 인증으로 아이디 찾기와 비밀번호 재설정을 제공한다.
- 로그인 후 비밀번호 변경, 로그아웃, 회원탈퇴를 제공한다.
- 로그인 사용자별로 Todo 데이터를 분리한다.

## 현재 Task

UI task 체크리스트와 완료 전 Audit 문서화 완료.

완료 조건:

- UI 작업 시작 전 Preflight를 확인할 단일 문서를 추가한다.
- Figma 확인, Design System Gate, 구현 전 Task Template, 완료 전 Audit 기준을 문서화한다.
- `AGENTS.md`, `agent-work-loop`, `agent-workflow`가 checklist를 참조한다.

검증:

- `npm run check`가 통과한다.

테스트:

- 운영 문서 보강 task라 새 product test는 추가하지 않았다.

다음:

- 다음 UX/UI 보강 task는 새 플랜을 작성한 뒤 승인받고 진행한다.

## 최근 완료 Task

UI task 체크리스트와 완료 전 Audit 문서화.

완료 조건:

- UI 작업 시작 전 Preflight를 확인할 단일 문서를 추가한다.
- Figma 확인, Design System Gate, 구현 전 Task Template, 완료 전 Audit 기준을 문서화한다.
- `AGENTS.md`, `agent-work-loop`, `agent-workflow`가 checklist를 참조한다.

검증:

- `npm run check`가 통과한다.

테스트:

- 운영 문서 보강 task라 새 product test는 추가하지 않았다.

이전 완료 Task:

Auth Form Controls의 shared UI와 showcase 수습.

완료 조건:

- Figma `Auth Components(2006:2)` 기준 form field, password input, text action을 shared UI로 승격한다.
- `/showcase`에 Auth Form Controls와 실제 로그인 form 조합을 추가한다.
- `AuthGate`는 inline Field/TextAction 대신 shared UI를 재사용한다.
- workflow 문서와 skill에 Figma Components 변경 시 shared UI와 `/showcase` 반영 게이트를 명시한다.

검증:

- `npm run test -- apps/web/src/shared/ui/auth-form-controls.test.tsx apps/web/src/app/app.test.tsx apps/web/src/pages/auth-gate.test.tsx`가 통과한다.
- `npm run check`가 통과한다.

테스트:

- Auth form controls component test와 showcase routing test를 추가했다.

이전 완료 Task:

아이디 찾기와 비밀번호 재설정 인증 화면의 로그인 복귀 UX 보강.

완료 조건:

- Figma `Auth Screen / 아이디 찾기(2006:106)`와 `Auth Screen / 비밀번호 재설정 인증(2006:126)`에 `로그인으로 돌아가기` 액션을 추가한다.
- Web 아이디 찾기 화면에서 로그인 화면으로 돌아갈 수 있다.
- Web 비밀번호 재설정 인증 화면에서 로그인 화면으로 돌아갈 수 있다.

검증:

- Figma metadata로 `2006:110`, `2006:130`의 `Secondary Actions` 추가를 확인한다.
- `npm run test -- apps/web/src/pages/auth-gate.test.tsx`가 통과한다.
- `npm run check`가 통과한다.

테스트:

- AuthGate component test에 아이디 찾기와 비밀번호 재설정 인증 화면의 로그인 복귀 동작을 추가했다.

이전 완료 Task:

Auth 입력 placeholder와 비밀번호 표시 토글의 Figma 정합성 보정.

완료 조건:

- Figma `Auth Screen / 회원가입(2006:97)` 기준으로 회원가입 입력 placeholder를 코드 화면에 반영한다.
- 비밀번호 입력에 `표시`/`숨김` 토글을 제공한다.
- 아이디 찾기, 비밀번호 재설정, 계정 관리 입력도 같은 Field 기준을 재사용한다.

검증:

- `npm run test -- apps/web/src/pages/auth-gate.test.tsx`가 통과한다.
- `npm run check`가 통과한다.

테스트:

- AuthGate component test에 회원가입 placeholder와 비밀번호 표시 토글 검증을 추가했다.

이전 완료 Task:

Figma Components page title과 첫 section 간격 보정.

완료 조건:

- Components page의 page title과 첫 content section 사이 여백을 충분히 확보한다.
- 앞으로 page title 아래 첫 section 배치 시 최소 여백 기준을 적용하도록 규칙을 보강한다.

검증:

- Figma metadata로 Components page 주요 section 좌표를 확인한다.
- `npm run check`가 통과한다.

테스트:

- Figma 배치와 운영 규칙 보강 task라 새 product test는 추가하지 않는다.

이전 완료 Task:

Figma Auth section 배치와 겹침 방지 규칙 보강.

완료 조건:

- Components 페이지의 `Auth Components` 영역이 기존 component section과 겹치지 않는다.
- Screens 페이지의 `Auth Screens` 영역이 기존 screen row와 같은 `y` 기준에 맞는다.
- 앞으로 Figma section/frame 추가나 이동 시 sibling bounding box 겹침 검사를 강제하는 규칙이 문서화되어 있다.

검증:

- Figma metadata로 대표 node 좌표를 확인한다.
- `npm run check`가 통과한다.

테스트:

- Figma 배치와 운영 규칙 보강 task라 새 product test는 추가하지 않는다.

이전 완료 Task:

Auth/Todo 화면 1차 UX 보정.

완료 조건:

- 회원가입 화면의 `이미 계정이 있습니다` 문구를 사용자를 단정하지 않는 문구로 바꾼다.
- Todo 화면의 `추가` 버튼 크기를 기존 Todo Screens 기준으로 되돌리고, Auth Screens의 로그인 후 Todo 화면도 같은 기준으로 맞춘다.

검증:

- `npm run check`가 통과한다.

테스트:

- Auth/Todo page component test를 갱신했다.

이전 완료 Task:

Auth Web 화면 Figma 정합성 보정.

완료 조건:

- Figma `Auth Screens(2006:51)` 기준으로 로그인, 회원가입, 아이디 찾기, 비밀번호 재설정, 계정 관리, 회원탈퇴 확인 화면 구조를 맞춘다.
- Todo 화면의 계정/로그아웃 버튼과 입력 행 폭을 Figma 기준에 맞춘다.
- 변경된 화면 흐름의 component test와 Auth E2E가 통과한다.

검증:

- `npm run check`가 통과한다.
- `npm run e2e -- e2e/auth-flow.e2e.ts`가 통과한다.

테스트:

- Auth/Todo page component test와 Auth E2E selector를 Figma 화면 흐름 기준으로 갱신했다.

이전 완료 Task:

Auth와 계정 관리 확장 phase 정리.

완료 조건:

- Auth와 계정 관리 확장 task가 모두 완료된 상태로 정리되어 있다.
- 남은 운영 리스크가 실제 SMTP provider 설정으로 좁혀져 있다.
- 다음 task는 사용자 승인 후 선택하도록 남아 있다.

검증:

- `npm run check`가 통과한다.

테스트:

- 문서 정리 task라 새 테스트는 추가하지 않았다.

## 다음 Task 후보

1. 실제 SMTP provider 설정과 배포 환경변수 정리
2. 기존 제품/설계/개발 문서 archive 검토

## 중단 조건

- 실제 SMTP provider, 계정, 환경변수 정책을 확정해야 하는 경우.
- 회원탈퇴를 hard delete가 아니라 soft delete로 바꿔야 하는 경우.
