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

Auth 저장 구조와 repository 확장.

목표:

- 사용자, refresh token, 이메일 인증 기록을 저장하고 Todo를 사용자 소유 데이터로 분리한다.
- users, refresh_tokens, email_verifications table을 추가한다.
- todos table에 user id 참조를 추가한다.
- 사용자 삭제 시 관련 Todo, refresh token, 이메일 인증 기록을 함께 삭제한다.
- repository가 사용자, refresh token, 이메일 인증 기록의 핵심 동작을 지원한다.

검증:

- migration 테스트가 통과한다.
- repository integration test가 통과한다.
- `npm run check`가 통과한다.

테스트 예외:

- 없음. 기능 구현 task라 TDD로 진행한다.

## 최근 완료 Task

Auth domain model과 schema 정의.

완료 조건:

- User model에 id, loginId, nickname, email, passwordHash, createdAt이 있다.
- loginId, nickname, email, password 입력 검증 schema가 있다.
- 이메일 인증 코드 생성, 만료, 사용 처리 규칙이 있다.
- refresh token snapshot과 만료 규칙이 있다.
- password hash 라이브러리 선택이 ADR과 decisions에 기록되어 있다.

검증:

- `npm run test -- packages/domain/src/user.test.ts packages/domain/src/auth-schemas.test.ts packages/domain/src/email-verification.test.ts packages/domain/src/refresh-token.test.ts` 통과
- `npm run test -- packages/db/src/migrate.test.ts packages/db/src/todo-repository.test.ts apps/api/src/todos/todos.module.test.ts` 통과
- `npm run check` 통과

테스트:

- Vitest domain unit/schema test

## 다음 Task 후보

1. Auth 저장 구조와 repository 확장
2. Nodemailer mail sender 구현
3. Auth API 기본 인증 흐름 구현

## 중단 조건

- password hash 라이브러리 또는 비용 설정을 결정해야 하는 경우.
- 실제 SMTP provider, 계정, 환경변수 정책을 확정해야 하는 경우.
- refresh token 만료 시간이나 access token 만료 시간을 확정해야 하는 경우.
- 회원탈퇴를 hard delete가 아니라 soft delete로 바꿔야 하는 경우.
