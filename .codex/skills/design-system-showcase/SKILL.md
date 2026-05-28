---
name: design-system-showcase
description: Use for this project when translating Figma Components into React shared UI components, adding component variants, updating Tailwind/CVA styles, or maintaining the /showcase page.
---

# Design System Showcase

이 skill은 Figma Components를 코드 디자인 시스템으로 옮기거나 showcase 페이지를 관리할 때 사용한다.

## 기준

Figma의 Components 페이지를 코드 컴포넌트의 시각 기준으로 삼는다.

코드 컴포넌트는 실제 Todo 화면보다 먼저 showcase에서 검증한다.

Figma `Components` 페이지에 새 컴포넌트, component group, variant, form control, reusable action이 생겼거나 기존 컴포넌트 상태가 확장되면 반드시 이 skill을 적용한다. 실제 화면에만 inline으로 구현하고 `/showcase`를 건너뛰면 완료로 보지 않는다.

## 기본 흐름

1. Figma Components 페이지에서 대상 컴포넌트를 확인한다.
2. 필요한 경우 `figma-design-sync` skill 기준으로 metadata를 확인한다.
3. `apps/web/src/shared/ui`에 코드 컴포넌트를 만든다.
4. variant가 필요한 컴포넌트는 `class-variance-authority`를 사용한다.
5. 조건부 class 조합은 `cn` 유틸을 사용한다.
6. `/showcase` 페이지에 상태별 예시를 추가한다.
7. 실제 Todo/Auth 화면에서는 showcase에 등록된 컴포넌트를 재사용한다.
8. 실제 화면 구현 후 shared UI를 우회한 inline duplicate가 남아 있지 않은지 확인한다.

## 컴포넌트 대상

초기 대상:

- Button
- Text Input
- Checkbox
- Todo Item
- Empty State
- Error Message
- Auth Form Controls
- Password Input
- Text Action

## 스타일링 규칙

- Tailwind CSS v4를 사용한다.
- 반복되는 variant는 CVA로 선언한다.
- 단순한 일회성 스타일에는 CVA를 강제하지 않는다.
- className 조합은 `clsx`와 `tailwind-merge`를 감싼 `cn` 유틸로 처리한다.
- Figma 토큰과 다른 임의 색상/간격을 추가할 때는 이유를 설명한다.

## Showcase 기준

`/showcase`는 다음을 보여준다.

- 컴포넌트 이름
- 컴포넌트 용도
- 상태별 예시
- 실제 Todo 화면에서 사용하는 조합

Showcase는 문서가 아니라 실행 가능한 UI 검증 공간이다.

## 완료 조건

디자인 시스템 컴포넌트 작업은 다음을 만족해야 완료로 본다.

- Figma 기준 상태가 코드로 표현되어 있다.
- showcase에서 상태별 예시를 확인할 수 있다.
- 필요한 경우 component test가 있다.
- 실제 앱 화면이 같은 컴포넌트를 재사용한다.
- 완료 보고에 참고한 Figma Components node, showcase 추가 위치, 실제 화면 재사용 위치를 포함한다.
