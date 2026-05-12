# ADR 0001: 초기 기술 스택 결정

## 상태

Accepted

## 맥락

Todo App은 일반 사용자를 위한 최소 기능 체크리스트형 Todo 앱이다.

이 프로젝트는 단순한 CRUD 구현보다 AI Agent와 함께 실무형 개발 과정을 연습하는 것이 중요하다. 따라서 프론트엔드, 백엔드, 데이터베이스, 테스트, 문서화의 경계를 작게라도 명확히 경험할 수 있는 구조가 필요하다.

또한 PGlite를 사용해 로컬 환경에서 PostgreSQL에 가까운 데이터베이스 경험을 가져가기로 했다.

## 결정

프로젝트는 프론트엔드와 백엔드를 분리한 npm workspaces 기반 monorepo로 구성한다.

### 프로젝트 구조

```text
apps/
  web/
  api/
packages/
  domain/
  db/
docs/
```

### 프론트엔드

- React
- TypeScript
- Vite
- React Router v7
- Tailwind CSS v4
- TanStack Query
- Zustand
- axios
- react-hook-form
- @hookform/resolvers
- clsx
- tailwind-merge
- class-variance-authority

### 백엔드

- NestJS
- TypeScript
- Zod

### 데이터베이스

- PGlite
- Drizzle ORM

### 품질 도구

- Biome
- Vitest
- Testing Library
- Playwright

## 이유

### 프론트엔드와 백엔드 분리

프론트엔드와 백엔드를 명확히 분리하면 API 설계, 서버 상태 관리, 백엔드 테스트, 데이터베이스 계층을 각각 독립적으로 연습할 수 있다.

AI Agent에게도 `apps/web`, `apps/api`, `packages/domain`, `packages/db`처럼 작업 경계를 명확히 줄 수 있다.

### React, TypeScript, Vite, React Router

React는 실무에서 널리 쓰이며 Figma 화면을 컴포넌트로 옮기는 연습에 적합하다.

TypeScript는 프론트엔드, 백엔드, 도메인, 데이터베이스 계층의 계약을 명확히 드러내기 위해 사용한다.

Vite는 작은 프론트엔드 앱을 빠르게 개발하고 테스트하기에 적합하다.

React Router v7은 실제 Todo 앱 화면과 디자인 시스템 showcase 페이지를 분리하기 위해 사용한다.

### Tailwind CSS v4와 class 유틸리티

Tailwind CSS v4는 Figma의 색상, 간격, 타이포그래피 토큰을 구현에 옮기는 연습에 적합하다.

`clsx`와 `tailwind-merge`는 조건부 className 조합과 Tailwind class 충돌 정리를 위해 사용한다.

`class-variance-authority`는 Button, Text Input, Todo Item처럼 variant가 필요한 컴포넌트의 스타일 규칙을 선언적으로 관리하기 위해 사용한다.

### TanStack Query, Zustand, axios

TanStack Query는 todo 목록 조회, 생성, 완료 변경, 삭제처럼 서버 상태를 다루기 위해 사용한다.

Zustand는 서버 데이터가 아니라 클라이언트 UI 상태를 다루기 위해 사용한다.

axios는 API client를 구성하고 baseURL, 에러 처리, 응답 타입을 일관되게 관리하기 위해 사용한다.

### React Hook Form과 Zod

React Hook Form은 프론트엔드 폼 상태, submit 처리, 에러 표시를 관리하기 위해 사용한다.

`@hookform/resolvers`는 React Hook Form과 Zod 스키마를 연결하기 위해 사용한다.

Zod는 백엔드 요청 검증뿐 아니라 프론트엔드 입력 검증에도 사용한다. 가능한 경우 Todo 입력 규칙은 공통 패키지에 두어 프론트엔드와 백엔드가 같은 검증 규칙을 사용하도록 한다.

### NestJS

NestJS는 module, controller, service, provider 구조를 통해 실무형 백엔드 구조를 연습하기에 적합하다.

Todo 앱 자체에는 다소 무거울 수 있지만, 이 프로젝트의 목적은 작은 기능을 실제 프로젝트처럼 나누어 구현하고 검증하는 것이므로 명시적인 구조의 이점이 크다.

### Zod

Zod는 요청 검증과 스키마 정의를 명확히 하기 위해 사용한다.

NestJS의 전통적인 `class-validator` 대신 Zod를 사용해 프론트엔드와 백엔드 사이의 데이터 계약을 더 명시적으로 다룬다.

### PGlite와 Drizzle ORM

PGlite는 별도 PostgreSQL 서버 없이 로컬에서 PostgreSQL에 가까운 경험을 제공한다.

Drizzle ORM은 TypeScript 친화적이며 SQL 구조를 비교적 직접적으로 드러낸다. Prisma보다 가볍고, raw SQL보다 타입 안정성과 스키마 관리 경험을 제공한다.

### Biome, Vitest, Testing Library, Playwright

Biome은 lint와 format을 통합해 코드 스타일 검증을 단순화한다.

Vitest는 프론트엔드, 백엔드, domain 계층 테스트에 사용한다.

Testing Library는 React 컴포넌트 테스트에 사용한다.

Playwright는 실제 사용자 흐름을 검증하는 E2E 테스트에 사용한다.

## 대안

### 풀스택 프레임워크

Next.js, Remix, SvelteKit 같은 풀스택 프레임워크도 고려할 수 있다.

하지만 이번 프로젝트에서는 프론트엔드와 백엔드 경계를 명확히 나누는 연습을 우선하므로 선택하지 않는다.

### Hono 또는 Fastify

Hono와 Fastify는 NestJS보다 가볍고 작은 API 서버에 적합하다.

하지만 이번 프로젝트에서는 실무형 백엔드 구조, DI, controller/service/module 패턴을 연습하기 위해 NestJS를 선택한다.

### CSS Modules

CSS Modules는 단순하고 명시적이며 작은 앱에 충분하다.

하지만 Figma 디자인 토큰을 구현에 옮기고, variant 기반 컴포넌트 스타일링을 연습하기 위해 Tailwind CSS v4와 관련 유틸리티를 선택한다.

### Prisma

Prisma는 생산성이 높고 schema 중심 경험이 좋다.

하지만 PGlite와의 가벼운 로컬 개발 경험, SQL에 가까운 구조, TypeScript 친화성을 고려해 Drizzle ORM을 선택한다.

## 결과

이 결정으로 프로젝트는 작은 Todo 앱이지만 실무형 프론트엔드, 백엔드, 데이터베이스, 테스트 구조를 함께 연습하는 형태가 된다.

도구가 많아지는 만큼 각 도구의 책임을 명확히 제한한다.

- TanStack Query는 서버 상태만 다룬다.
- Zustand는 클라이언트 UI 상태만 다룬다.
- React Hook Form은 폼 상태와 submit 흐름을 담당한다.
- Drizzle은 데이터베이스 스키마와 query를 담당한다.
- Zod는 프론트엔드 입력 검증과 API 요청 계약 검증에 사용한다.
- Playwright는 UI 구현 이후 핵심 사용자 흐름부터 도입한다.
