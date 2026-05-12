---
name: tdd-clean-architecture
description: Use for this project when implementing or modifying frontend, backend, domain, database, or API behavior with TDD and clean architecture boundaries. Applies to feature work, bug fixes, refactoring, and tests.
---

# TDD Clean Architecture

이 skill은 기능 구현, 버그 수정, 리팩터링 작업에 사용한다.

## 기본 흐름

1. 관련 문서를 확인한다.
   - `docs/requirements.md`
   - `docs/user-flow.md`
   - `docs/adr/0001-tech-stack.md`
   - `docs/adr/0002-development-architecture.md`
2. 요구사항을 검증 가능한 인수 조건으로 정리한다.
3. 실패하는 테스트를 먼저 작성한다.
4. 테스트를 통과하는 최소 구현을 작성한다.
5. 리팩터링한다.
6. 관련 검증 명령을 실행한다.
7. 변경 내용, 검증 결과, 남은 리스크를 한국어로 보고한다.

## 의존성 방향

도메인 규칙은 바깥 계층에 의존하지 않는다.

허용되는 방향:

```text
presentation -> application -> domain
infrastructure -> application/domain contract
```

피해야 할 방향:

```text
domain -> database
domain -> HTTP
domain -> UI
application -> concrete database client
```

## 백엔드 작업 기준

NestJS에서는 계층을 다음처럼 나눈다.

- `presentation`: controller, request/response 변환
- `application`: use case, service, transaction boundary
- `domain`: entity, policy, domain rule
- `infrastructure`: repository implementation, Drizzle/PGlite 접근

테스트 우선순위:

- domain rule unit test
- application use case test
- controller test
- repository integration test

## 프론트엔드 작업 기준

프론트엔드는 백엔드 계층 구조를 그대로 복사하지 않는다.

기본 역할:

- `app`: router, provider, 앱 조립
- `pages`: route 단위 화면
- `features`: 사용자 행위 중심 기능
- `entities`: Todo 모델과 표시 단위
- `shared`: 공통 UI, API client, lib

서버 상태는 TanStack Query로 다룬다.

클라이언트 UI 상태는 Zustand로 다룬다.

폼 상태와 submit 흐름은 React Hook Form으로 다룬다.

검증 규칙은 Zod를 우선한다.

## TDD 체크리스트

작업 전:

- 요구사항이 문서에 있는가?
- 인수 조건이 명확한가?
- 어느 계층의 테스트가 먼저 필요한가?

작업 중:

- 실패하는 테스트를 먼저 확인했는가?
- 최소 구현으로 통과시켰는가?
- 테스트 없이 구현을 넓히고 있지 않은가?

작업 후:

- 리팩터링 후에도 테스트가 통과하는가?
- 의존성 방향이 유지되는가?
- 변경 범위가 요청보다 커지지 않았는가?
