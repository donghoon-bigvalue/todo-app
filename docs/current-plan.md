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
- 기존 제품/설계/개발 문서는 아직 이동하거나 archive하지 않는다.

## 현재 Phase

Auth와 계정 관리 확장 진행 중.

목표:

- 로그인 ID, 닉네임, 이메일, 비밀번호 기반 회원가입을 제공한다.
- JWT access token과 HTTP-only cookie refresh token 기반 로그인을 제공한다.
- 실제 메일 발송 기반 이메일 인증으로 아이디 찾기와 비밀번호 재설정을 제공한다.
- 로그인 후 비밀번호 변경, 로그아웃, 회원탈퇴를 제공한다.
- 로그인 사용자별로 Todo 데이터를 분리한다.

## 현재 Task

다음 task 승인 대기.

추천 task:

Auth domain model과 schema 정의.

목표:

- UI, API, DB에 의존하지 않는 사용자, 인증, 이메일 인증, refresh token 핵심 규칙을 정의한다.
- User model과 loginId, nickname, email, password 입력 검증 schema를 만든다.
- 이메일 인증 코드 생성, 만료, 사용 처리 규칙을 정의한다.
- refresh token snapshot과 만료 규칙을 정의한다.

검증:

- domain unit test와 schema unit test가 통과한다.
- `npm run check`가 통과한다.

테스트 예외:

- 없음. 기능 구현 task라 TDD로 진행한다.

## 최근 완료 Task

Auth Figma 디자인 업데이트.

완료 조건:

- 기존 Figma 디자인을 삭제하거나 덮어쓰지 않고 Auth 컴포넌트와 화면을 추가한다.
- 기존 디자인 토큰과 컴포넌트 스타일을 유지한다.
- 로그인, 회원가입, 아이디 찾기, 비밀번호 재설정, 계정 관리, 회원탈퇴, 로그인 후 Todo 화면 상태가 있다.
- 대표 노드 metadata와 screenshot으로 검증한다.

검증:

- 쓰기 전 read-only inventory 확인
- `Auth Components` node `2006:2` metadata 확인
- `Auth Screens` node `2006:51` metadata 확인
- screenshot으로 Components와 Screens 확인

테스트:

- Figma 디자인 task라 코드 테스트 대상은 아니다.

## 다음 Task 후보

1. Auth domain model과 schema 정의
2. Auth 저장 구조와 repository 확장
3. Nodemailer mail sender 구현

## 중단 조건

- password hash 라이브러리 또는 비용 설정을 결정해야 하는 경우.
- 실제 SMTP provider, 계정, 환경변수 정책을 확정해야 하는 경우.
- refresh token 만료 시간이나 access token 만료 시간을 확정해야 하는 경우.
- 회원탈퇴를 hard delete가 아니라 soft delete로 바꿔야 하는 경우.
