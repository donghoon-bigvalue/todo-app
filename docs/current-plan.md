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

Auth Figma 디자인 업데이트.

목표:

- Auth 확장에 필요한 화면과 form 상태를 코드 구현 전에 Figma 기준으로 정의한다.
- 로그인, 회원가입, 아이디 찾기, 비밀번호 재설정, 비밀번호 변경, 회원탈퇴 화면을 만든다.
- Todo 화면에 사용자 닉네임, 로그아웃, 계정 관리 진입을 반영한다.

검증:

- Figma metadata 확인
- 필요 시 screenshot 확인

테스트 예외:

- Figma 디자인 task는 코드 테스트 대상이 아니다.

## 최근 완료 Task

Auth 기능 제품 문서화.

완료 조건:

- 승인된 Auth 기능 범위가 제품 문서, 요구사항, 사용자 흐름, 디자인 브리프에 반영되어 있다.
- Auth 구현 계획이 `docs/implementation-plan.md`에 반영되어 있다.
- JWT, refresh token, Nodemailer, hard delete 회원탈퇴 전략이 ADR로 기록되어 있다.

검증:

- `npm run check` 통과

테스트:

- 문서 task라 별도 테스트는 없다.

## 다음 Task 후보

1. Auth Figma 디자인 업데이트
2. Auth domain model과 schema 정의
3. Auth 저장 구조와 repository 확장

## 중단 조건

- Auth 화면 기준을 Figma 없이 코드부터 구현해야 하는 경우.
- password hash 라이브러리 또는 비용 설정을 결정해야 하는 경우.
- 실제 SMTP provider, 계정, 환경변수 정책을 확정해야 하는 경우.
- refresh token 만료 시간이나 access token 만료 시간을 확정해야 하는 경우.
- 회원탈퇴를 hard delete가 아니라 soft delete로 바꿔야 하는 경우.
