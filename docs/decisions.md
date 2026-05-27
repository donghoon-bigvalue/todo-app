# Decisions

이 문서는 Agent가 매번 전체 ADR과 긴 제품 문서를 읽지 않도록 주요 결정을 짧게 요약한 인덱스다. 상세 근거는 링크된 원문을 확인한다.

## 제품 결정

### Todo App MVP

상태: Accepted

결정:

- 개인 사용자를 위한 최소 기능 체크리스트형 Todo 앱으로 만든다.
- 완료된 할 일은 목록에서 숨기지 않고 같은 목록에 남긴다.
- 완료된 할 일은 체크박스, 낮은 강조도, 필요 시 취소선으로 구분한다.

근거:

- 사용자가 완료한 일을 계속 확인할 수 있다.
- 완료 상태를 다시 되돌리는 동작이 단순하다.

Reference:

- [제품 기획서](product-brief.md)
- [요구사항 정의서](requirements.md)
- [사용자 흐름](user-flow.md)

### Todo 메모 확장

상태: Accepted

결정:

- 할 일 생성 시점에는 메모를 입력하지 않는다.
- 메모는 생성된 Todo 항목에서 나중에 추가, 수정, 비울 수 있게 한다.
- 목록에서는 메모가 있는 항목만 제목 아래에 2줄까지 표시한다.
- 메모 편집은 인라인 확장형으로 제공한다.
- 메모 편집은 한 번에 하나의 Todo에서만 열린다.
- 빈 값으로 저장하면 메모를 삭제한다.
- 완료된 Todo도 메모를 볼 수 있고 수정할 수 있다.

근거:

- 할 일 추가 속도를 해치지 않는다.
- 메모 기능이 Todo 목록 흐름보다 커지지 않는다.
- 모달이나 상세 페이지 없이 작은 확장으로 가치를 검증할 수 있다.

Reference:

- [제품 기획서](product-brief.md)
- [요구사항 정의서](requirements.md)
- [사용자 흐름](user-flow.md)
- [디자인 브리프](design-brief.md)

### Auth와 계정 관리 확장

상태: Accepted

결정:

- 회원가입 시 로그인 ID, 닉네임, 이메일, 비밀번호를 입력받는다.
- 로그인은 이메일이 아니라 로그인 ID와 비밀번호로 진행한다.
- Todo 데이터는 로그인한 사용자별로 분리한다.
- 사용자는 로그아웃할 수 있다.
- 아이디 찾기와 비밀번호 재설정은 이메일 인증 후 진행한다.
- 이메일 인증은 실제 메일 발송을 포함한다.
- 로그인한 사용자는 현재 비밀번호 확인 후 비밀번호를 변경할 수 있다.
- 회원탈퇴는 비밀번호 재확인 후 hard delete로 처리한다.
- 회원탈퇴 후 같은 로그인 ID와 이메일로 다시 가입할 수 있다.

근거:

- 로그인 ID와 이메일을 분리하면 사용자가 로그인 ID를 잊었을 때 이메일 인증 기반 복구 흐름을 제공할 수 있다.
- 사용자별 Todo 분리는 계정 기능의 핵심 가치다.
- 현재 제품에는 계정 복구나 감사 로그 요구사항이 없으므로 hard delete가 단순하다.

Reference:

- [제품 기획서](product-brief.md)
- [요구사항 정의서](requirements.md)
- [사용자 흐름](user-flow.md)
- [디자인 브리프](design-brief.md)

## 기술 결정

### 초기 기술 스택

상태: Accepted

결정:

- npm workspaces 기반 monorepo를 사용한다.
- Web은 React, TypeScript, Vite, React Router, Tailwind CSS를 사용한다.
- API는 NestJS와 TypeScript를 사용한다.
- Data 계층은 PGlite와 Drizzle ORM을 사용한다.
- 테스트는 Vitest, Testing Library, Playwright를 사용한다.
- 품질 도구는 Biome을 사용한다.

Reference:

- [ADR 0001: 초기 기술 스택 결정](adr/0001-tech-stack.md)

### 개발 방식과 아키텍처

상태: Accepted

결정:

- 프론트엔드와 백엔드 모두 클린 아키텍처 원칙을 적용한다.
- 기능 구현은 TDD 흐름을 기본으로 한다.
- Figma Components 페이지를 코드 디자인 시스템의 기준으로 삼는다.
- 코드 컴포넌트는 showcase 페이지에서 확인할 수 있게 한다.

Reference:

- [ADR 0002: 개발 방식과 아키텍처 원칙](adr/0002-development-architecture.md)

### Zustand 미적용

상태: Accepted

결정:

- MVP에서는 Zustand를 설치하지 않는다.
- 서버 상태는 TanStack Query, 폼 상태는 React Hook Form, 라우팅 상태는 React Router로 처리한다.
- 서버와 무관한 클라이언트 UI 상태가 실제로 생기면 다시 검토한다.

Reference:

- [ADR 0001: 초기 기술 스택 결정](adr/0001-tech-stack.md)

### Husky Git hooks 도입

상태: Accepted

결정:

- Husky를 사용해 commit과 push 전에 검증 명령을 실행한다.
- `pre-commit`은 `format:check`, `lint`, `typecheck`만 실행한다.
- `pre-push`는 `npm run check`로 전체 기본 검증을 실행한다.
- Playwright E2E는 기본 hook에 포함하지 않고, UI 흐름 변경 task에서 별도로 실행한다.

근거:

- Agent Harness의 검증 규칙을 Git 이벤트에 연결해 누락을 줄인다.
- 커밋은 자주 발생하므로 빠른 정적 검증만 실행한다.
- 푸시는 원격 반영 직전이므로 테스트까지 포함한 기본 검증을 실행한다.

Reference:

- [개발 가이드](development-guide.md)

### Auth와 계정 관리 전략

상태: Accepted

결정:

- JWT 기반 인증을 사용한다.
- access token은 응답 body로 전달한다.
- refresh token은 HTTP-only cookie로 전달한다.
- refresh token 원문은 DB에 저장하지 않고 hash로 저장한다.
- 메일 발송은 Nodemailer를 사용한다.
- password hash는 `bcryptjs`를 사용한다.
- 회원탈퇴는 hard delete와 관련 데이터 cascade 삭제로 처리한다.

Reference:

- [ADR 0003: Auth와 계정 관리 전략](adr/0003-auth-account-strategy.md)

## Agent Harness 결정

### Idea Intake는 초안 우선형

상태: Accepted

결정:

- 사용자가 새 아이디어를 말하면 Agent는 바로 구현하지 않는다.
- 먼저 채팅에서 제품 초안을 제시한다.
- 초안은 수정 가능한 가정 목록으로 작성한다.

Reference:

- [Agent Harness](agent-harness.md)

### 채팅 승인 후 문서화

상태: Accepted

결정:

- 제품 초안 단계에서는 파일을 만들거나 수정하지 않는다.
- 사용자가 초안을 승인하면 그때 승인된 내용을 제품 문서와 implementation plan으로 내린다.

Reference:

- [Agent Harness](agent-harness.md)

### 기본 컨텍스트는 운영 문서 중심

상태: Accepted

결정:

- Agent는 모든 `docs/` 문서를 매번 읽지 않는다.
- 기본 컨텍스트는 `project-brief.md`, `current-plan.md`, `decisions.md`, `task-log.md` 같은 짧은 운영 문서로 제한한다.
- 긴 문서는 현재 task와 관련 있을 때만 reference로 읽는다.

Reference:

- [Agent Harness](agent-harness.md)

### Archive는 주제 기준

상태: Accepted

결정:

- 일반 archive는 날짜가 아니라 주제 기준으로 정리한다.
- 날짜는 문서 metadata에 기록한다.
- 특정 시점 전체 상태 보존이 필요할 때만 `snapshots/YYYY-MM-DD-label/`를 사용한다.

Reference:

- [Agent Harness](agent-harness.md)
