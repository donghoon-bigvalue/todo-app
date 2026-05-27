# ADR 0003: Auth와 계정 관리 전략

## 상태

Accepted

## 맥락

Todo App은 MVP와 Todo 메모 확장을 완료한 뒤, 사용자별 Todo 데이터 분리를 위해 계정 기능을 추가한다.

사용자는 회원가입, 로그인, 로그아웃, 아이디 찾기, 비밀번호 재설정, 로그인 후 비밀번호 변경, 회원탈퇴를 할 수 있어야 한다.

사용자는 로그인 ID와 이메일을 분리해서 사용한다. 로그인은 로그인 ID로 진행하고, 이메일은 아이디 찾기와 비밀번호 재설정 인증에 사용한다.

## 결정

### 사용자 식별

- 회원가입 시 `loginId`, `nickname`, `email`, `password`를 입력받는다.
- 로그인은 `loginId`와 `password`로 진행한다.
- `loginId`와 `email`은 각각 전체 사용자 중 유일해야 한다.
- Todo는 로그인한 사용자 소유로 저장한다.

### 인증 방식

- JWT 기반 인증을 사용한다.
- access token은 로그인과 refresh 응답 body로 전달한다.
- refresh token은 HTTP-only cookie로 전달한다.
- refresh token 원문은 DB에 저장하지 않고 hash로 저장한다.
- 로그아웃하면 현재 refresh token을 무효화한다.
- 비밀번호 변경이나 비밀번호 재설정 이후 기존 refresh token은 무효화한다.
- access token 기본 만료 시간은 15분이다.
- refresh token 기본 만료 시간은 30일이다.

### 이메일 인증과 메일 발송

- 아이디 찾기와 비밀번호 재설정은 이메일 인증을 거쳐 진행한다.
- 이메일 인증 코드는 실제 메일로 발송한다.
- 메일 발송은 Nodemailer를 사용한다.
- SMTP 연결 정보는 환경변수로 주입한다.
- 테스트에서는 mail sender interface를 통해 fake sender를 사용한다.

### 비밀번호 저장

- 비밀번호는 평문으로 저장하지 않는다.
- 비밀번호 저장에는 단방향 password hash를 사용한다.
- MVP 구현에서는 `bcryptjs`를 사용한다.
- 기본 cost는 `12`를 사용한다.

### 회원탈퇴

- MVP에서는 회원탈퇴를 hard delete로 처리한다.
- 사용자 삭제 시 해당 사용자의 Todo, refresh token, 이메일 인증 기록도 함께 삭제한다.
- 탈퇴 후 같은 `loginId`와 `email`로 다시 가입할 수 있다.
- 계정 복구, 감사 로그, 보존 정책이 필요해지면 soft delete 또는 anonymization을 별도 task로 재검토한다.

## 이유

JWT access token과 refresh token을 분리하면 짧은 access token 만료와 로그인 유지 경험을 함께 제공할 수 있다.

refresh token을 HTTP-only cookie로 전달하면 프론트엔드 JavaScript에서 refresh token을 직접 다루지 않아도 된다.

refresh token 원문을 저장하지 않으면 DB 노출 시 refresh token 재사용 위험을 줄일 수 있다.

Nodemailer는 현재 NestJS API에서 SMTP 기반 실제 메일 발송을 작게 붙이기 적합하다. provider 종속성을 낮추기 위해 애플리케이션 계층에서는 mail sender interface에 의존한다.

회원탈퇴는 현재 제품에 계정 복구, 결제, 감사 로그, 법적 보존 요구사항이 없으므로 hard delete가 가장 단순하고 사용자의 기대와도 일치한다.

## 대안

### Session cookie

서버 session과 cookie 기반 인증도 가능하다.

하지만 이번 확장은 사용자가 JWT token 기반을 명시했으므로 선택하지 않는다.

### refresh token을 body로 전달

프론트엔드에서 refresh token을 직접 저장하고 전달하는 방식도 가능하다.

하지만 refresh token은 탈취 시 영향이 크므로 HTTP-only cookie로 전달한다.

### 실제 메일 발송 제외

개발 MVP에서는 인증 코드를 화면이나 로그로만 확인하게 할 수도 있다.

하지만 이번 확장에서는 실제 메일 발송이 승인된 범위이므로 Nodemailer 기반 SMTP 발송을 포함한다.

### soft delete 회원탈퇴

계정 복구나 감사 로그가 필요하다면 soft delete가 유리하다.

현재 MVP에서는 모든 query에 삭제 조건을 추가하고 재가입 정책을 복잡하게 만드는 비용이 더 크므로 hard delete를 선택한다.

## 결과

Auth 확장은 기존 Todo API와 DB 구조에 사용자 소유권을 추가한다.

다음 구현 계획에서는 Auth 화면 설계를 먼저 진행하고, 이후 domain, DB, API, Web, E2E 순서로 작게 나누어 진행한다.

구현 과정에서 새 dependency가 필요하다.

- Nodemailer
- JWT 발급과 검증 라이브러리
- `bcryptjs`

각 dependency는 해당 구현 task에서 설치하고 검증한다.
