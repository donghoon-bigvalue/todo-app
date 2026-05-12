# ADR 0002: 개발 방식과 아키텍처 원칙

## 상태

Accepted

## 맥락

Todo App은 작은 MVP지만, 이 프로젝트의 목적은 단순 구현보다 AI Agent와 함께 실무형 개발 과정을 연습하는 것이다.

따라서 구현 전에 개발 방식, 아키텍처 경계, 테스트 방식, 디자인 시스템 관리 방식을 명확히 정한다.

## 결정

프론트엔드와 백엔드 모두 클린 아키텍처의 원칙을 적용한다.

기능 구현은 TDD 흐름을 기본으로 진행한다.

Figma의 Components 페이지를 코드 디자인 시스템의 기준으로 삼고, 코드로 옮긴 컴포넌트는 showcase 페이지에서 확인할 수 있게 한다.

showcase 페이지와 실제 앱 화면을 분리하기 위해 React Router를 도입한다.

## 클린 아키텍처 적용 원칙

클린 아키텍처는 프레임워크나 폴더 이름을 맞추는 것이 아니라, 의존성 방향과 관심사 분리를 지키기 위해 적용한다.

핵심 규칙:

- 도메인 규칙은 UI, HTTP, DB에 의존하지 않는다.
- 애플리케이션 유스케이스는 도메인 규칙을 조합한다.
- 인프라 계층은 DB, HTTP client, 외부 라이브러리 세부사항을 담당한다.
- 프레젠테이션 계층은 사용자 입력과 출력 변환을 담당한다.

### 백엔드

백엔드는 NestJS 구조 안에서 계층을 명확히 나눈다.

예상 구조:

```text
apps/api/src/
  todos/
    presentation/
    application/
    domain/
    infrastructure/
```

역할:

- `presentation`: controller, request/response 변환
- `application`: use case, transaction boundary
- `domain`: entity, policy, domain rule
- `infrastructure`: repository implementation, PGlite/Drizzle 접근

### 프론트엔드

프론트엔드는 백엔드식 계층 구조를 그대로 복사하지 않는다.

대신 다음 원칙을 따른다.

- `app`: 라우터, provider, 앱 조립
- `pages`: 라우트 단위 화면
- `features`: 사용자 행위 중심 기능
- `entities`: Todo와 같은 도메인 개념의 UI/model
- `shared`: 공통 UI, 공통 lib, API client

예상 구조:

```text
apps/web/src/
  app/
  pages/
  features/
  entities/
  shared/
```

## TDD 원칙

기능 구현은 다음 흐름을 기본으로 한다.

1. 관련 요구사항과 인수 조건을 확인한다.
2. 실패하는 테스트를 먼저 작성한다.
3. 테스트를 통과하는 최소 구현을 작성한다.
4. 중복과 경계를 확인하며 리팩터링한다.
5. 관련 검증 명령을 실행한다.

테스트 우선순위:

- 도메인 규칙은 unit test를 우선한다.
- API 유스케이스는 application/service 테스트를 우선한다.
- UI는 사용자 행동 중심의 component test를 작성한다.
- E2E는 핵심 흐름이 연결된 뒤 Playwright로 작성한다.

## 디자인 시스템과 showcase

Figma의 Components 페이지를 코드 디자인 시스템의 기준으로 삼는다.

코드 컴포넌트는 `apps/web/src/shared/ui` 아래에 둔다.

showcase 페이지는 다음 목적을 가진다.

- Figma 컴포넌트를 코드로 옮긴 결과를 한 곳에서 확인한다.
- Button, Text Input, Checkbox, Todo Item, Empty State, Error Message의 상태별 예시를 보여준다.
- 실제 Todo 화면은 showcase에 있는 컴포넌트를 재사용한다.
- AI Agent가 UI를 수정할 때 Figma와 showcase를 비교할 수 있게 한다.

라우팅:

```text
/          실제 Todo 앱
/showcase  디자인 시스템 showcase
```

React Router를 사용해 실제 앱 화면과 showcase 페이지를 분리한다.

## 관련 로컬 skill

이 결정의 실행 절차는 다음 로컬 skill을 따른다.

- `.codex/skills/tdd-clean-architecture/SKILL.md`
- `.codex/skills/design-system-showcase/SKILL.md`
- `.codex/skills/figma-design-sync/SKILL.md`

## 결과

이 결정으로 프로젝트는 작은 Todo 앱이지만 다음을 연습할 수 있다.

- 프론트엔드와 백엔드의 계층 분리
- TDD 기반 기능 구현
- Figma 기반 디자인 시스템 관리
- 코드 컴포넌트 showcase 운영
- AI Agent가 검증 가능한 기준 안에서 작업하도록 만드는 하네스 구성

단점은 초기 구조와 문서가 MVP 규모에 비해 다소 커질 수 있다는 점이다.

이를 완화하기 위해 기능 구현은 항상 작은 단위로 진행하고, 필요하지 않은 추상화는 추가하지 않는다.
