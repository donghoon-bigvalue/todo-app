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

Web 계정 복구와 계정 관리 화면 연결.

목표:

- 사용자가 아이디 찾기, 비밀번호 재설정, 로그인 후 비밀번호 변경, 회원탈퇴를 웹에서 수행할 수 있다.
- 아이디 찾기 화면에서 이메일 인증 후 로그인 ID를 확인할 수 있다.
- 비밀번호 재설정 화면에서 이메일 인증 후 새 비밀번호를 설정할 수 있다.
- 로그인 후 계정 관리 화면에서 비밀번호 변경과 회원탈퇴를 실행할 수 있다.
- 회원탈퇴 후 인증 상태가 해소되고 로그인 화면으로 이동한다.

검증:

- 사용자 행동 중심 component test가 통과한다.
- Web Auth API wrapper test가 통과한다.
- `npm run check`가 통과한다.

테스트 예외:

- 없음. 기능 구현 task라 TDD로 진행한다.

## 최근 완료 Task

로그인 후 비밀번호 변경과 회원탈퇴 API 구현.

완료 조건:

- 로그인한 사용자가 현재 비밀번호를 확인한 뒤 새 비밀번호로 변경할 수 있다.
- 비밀번호 변경 후 기존 refresh token은 무효화된다.
- 로그인한 사용자가 비밀번호 재확인 후 자신의 계정을 탈퇴할 수 있다.
- 회원탈퇴는 hard delete로 처리한다.
- 회원탈퇴 후 같은 로그인 ID와 이메일로 다시 가입할 수 있다.
- 인증되지 않은 요청은 실패한다.

검증:

- Auth application/controller test가 통과한다.
- 관련 repository test가 통과한다.
- `npm run check`가 통과한다.

테스트:

- Vitest Auth application/controller/repository test

## 다음 Task 후보

1. Auth E2E 확장

## 중단 조건

- 실제 SMTP provider, 계정, 환경변수 정책을 확정해야 하는 경우.
- 회원탈퇴를 hard delete가 아니라 soft delete로 바꿔야 하는 경우.
