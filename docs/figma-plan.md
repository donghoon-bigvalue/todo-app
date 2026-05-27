# Figma 작업 계획

## 목적

이 문서는 Todo App MVP를 Figma에 옮길 때 만들 파일 구조, 페이지, 디자인 토큰, 컴포넌트, 화면 프레임을 정의한다.

Figma 작업의 목표는 완성도 높은 최종 디자인보다, 기획 문서와 요구사항을 실제 UI 구조로 변환하는 과정을 명확히 연습하는 것이다.

## 생성 목표

Figma에는 다음을 만든다.

- 최소 디자인 시스템
- 재사용 가능한 기본 컴포넌트
- MVP 화면 상태 프레임

## 파일 이름

```text
Todo App MVP
```

## Figma 파일 참조

실제 Figma 파일:

- [Todo App](https://www.figma.com/design/COA4ynKukuVp6aqqe1ECPM/Todo-App?node-id=4-2&p=f&m=dev)

페이지별 기준 node:

- [Cover](https://www.figma.com/design/COA4ynKukuVp6aqqe1ECPM/Todo-App?node-id=4-2&p=f&m=dev)
- [Design System](https://www.figma.com/design/COA4ynKukuVp6aqqe1ECPM/Todo-App?node-id=4-3&p=f&m=dev)
- [Components](https://www.figma.com/design/COA4ynKukuVp6aqqe1ECPM/Todo-App?node-id=4-4&p=f&m=dev)
- [Screens](https://www.figma.com/design/COA4ynKukuVp6aqqe1ECPM/Todo-App?node-id=4-5&p=f&m=dev)

현재 기준 file key:

```text
COA4ynKukuVp6aqqe1ECPM
```

Figma 컴포넌트를 코드로 옮길 때는 `Components` 페이지를 먼저 확인하고, 화면 구현을 할 때는 `Screens` 페이지를 기준으로 삼는다.

## 안전 작업 규칙

Figma 작업은 기존 디자인을 보존하면서 추가하거나 확장하는 방식으로 진행한다.

쓰기 작업 전에는 반드시 read-only inventory를 먼저 확인한다.

확인 항목:

- 기준 file key가 `COA4ynKukuVp6aqqe1ECPM`인지 확인한다.
- Cover, Design System, Components, Screens page가 존재하는지 확인한다.
- 각 page의 주요 frame 이름과 node id를 확인한다.
- 새 작업을 추가할 위치를 기존 화면과 겹치지 않는 영역으로 정한다.
- 기존 Components와 Screens가 instance 연결인지 단순 복제인지 확인한다.

금지 항목:

- page 전체 비우기
- 기존 frame, component, screen 삭제
- 기존 node 대량 이동
- 기존 page/frame/component 이름 변경
- `clearPage(...)` 사용
- 기존 노드에 대한 `remove()` 사용

위 금지 항목이 필요하다고 판단되면 Figma를 수정하지 않고 먼저 사용자에게 이유와 대상 node id를 보고한다.

## 기존 스타일 유지 규칙

새 컴포넌트와 새 화면은 기존 디자인 시스템의 스타일을 유지한다.

작업 전 먼저 확인하고 재사용할 기준:

- Design System의 색상, 간격, 타이포그래피, radius 토큰
- Components의 Button, Text Input, Checkbox, Todo Item 상태와 크기
- Screens의 화면 width, padding, section 간격
- 기존 문구 톤과 label 방식

Auth 화면처럼 새 화면을 추가할 때도 기존 Todo 앱의 차분한 체크리스트 스타일을 유지한다.

새 스타일을 임의로 만들지 않는다. 새 상태가 필요하면 기존 컴포넌트를 복제해 같은 토큰으로 확장한다.

기존 스타일로 표현하기 어려운 새 패턴이 필요하면 먼저 대안을 제시하고 사용자 확인을 받는다.

## 페이지 구성

### 1. Cover

파일의 목적과 현재 범위를 요약한다.

포함 내용:

- 프로젝트 이름: `Todo App`
- 화면 제목: `할 일 체크리스트`
- 범위: MVP
- 설명: 최소 기능 체크리스트형 Todo 앱

### 2. Design System

색상, 간격, 타이포그래피, 형태 토큰을 정리한다.

포함 내용:

- 색상 토큰
- 간격 토큰
- 타이포그래피 토큰
- radius 토큰

### 3. Components

MVP 구현에 필요한 컴포넌트를 만든다.

포함 컴포넌트:

- Button
- Text Input
- Checkbox
- Todo Item
- Empty State
- Error Message

### 4. Screens

사용자 흐름과 디자인 브리프에서 정의한 화면 상태를 만든다.

포함 프레임:

- 빈 상태
- 기본 목록 상태
- 완료 항목 포함 상태
- 입력 에러 상태
- 메모가 있는 상태
- 메모 편집 상태

## 디자인 토큰

### 색상

초기 색상은 차분하고 명확한 체크리스트 앱에 맞춘다.

- `background`: `#F7F8FA`
- `surface`: `#FFFFFF`
- `text-primary`: `#1F2937`
- `text-secondary`: `#6B7280`
- `border`: `#E5E7EB`
- `accent`: `#2563EB`
- `danger`: `#DC2626`

### 간격

- `space-4`: 4
- `space-8`: 8
- `space-12`: 12
- `space-16`: 16
- `space-24`: 24
- `space-32`: 32

### 타이포그래피

기본 폰트는 `Pretendard`를 사용한다.

- `title`: 24px, 700
- `body`: 16px, 400
- `body-strong`: 16px, 600
- `supporting`: 14px, 400

### 형태

- `radius-small`: 8

## 컴포넌트 상세

### Button

필요 상태:

- 기본
- 강조
- 위험
- 비활성

용도:

- 할 일 추가
- 할 일 삭제

### Text Input

필요 상태:

- 기본
- 포커스
- 에러

용도:

- 할 일 입력

### Checkbox

필요 상태:

- 미체크
- 체크

용도:

- 할 일 완료 처리와 완료 취소

### Todo Item

필요 상태:

- 미완료
- 완료
- 메모 있음
- 메모 편집 중

표현 기준:

- 미완료 항목은 일반 텍스트로 표시한다.
- 완료 항목은 낮은 강조도와 취소선으로 표시한다.
- 메모가 있는 항목은 제목 아래에 메모를 2줄까지 표시한다.
- 메모 편집 중 상태는 textarea, 저장 버튼, 취소 버튼을 항목 안에 표시한다.
- 메모 편집은 한 번에 하나의 항목만 열린다.

### Empty State

할 일이 없는 상태를 안내한다.

예시 문구:

```text
아직 할 일이 없습니다.
```

### Error Message

빈 입력 제출 시 표시한다.

예시 문구:

```text
할 일을 입력해주세요.
```

## 화면 프레임 상세

### 빈 상태

포함 요소:

- 제목: `할 일 체크리스트`
- 남은 할 일 개수: `남은 할 일 0개`
- 입력창
- 추가 버튼
- 빈 상태 메시지

### 기본 목록 상태

포함 요소:

- 제목
- 남은 할 일 개수
- 입력창
- 추가 버튼
- 미완료 할 일 3개

예시 할 일:

- 장보기
- 이메일 답장하기
- 운동하기

### 완료 항목 포함 상태

포함 요소:

- 제목
- 남은 할 일 개수
- 입력창
- 추가 버튼
- 미완료 할 일
- 완료된 할 일

예시 할 일:

- 장보기
- 이메일 답장하기
- 운동하기

### 입력 에러 상태

포함 요소:

- 제목
- 남은 할 일 개수
- 입력창 에러 상태
- 에러 메시지: `할 일을 입력해주세요.`
- 기존 목록 상태

### 메모가 있는 상태

포함 요소:

- 제목
- 남은 할 일 개수
- 입력창
- 추가 버튼
- 메모가 있는 할 일
- 제목 아래 2줄까지 표시되는 메모
- 메모 수정 버튼
- 기존 삭제 버튼

### 메모 편집 상태

포함 요소:

- 제목
- 남은 할 일 개수
- 입력창
- 추가 버튼
- 메모 편집 중인 할 일
- 메모 textarea
- 저장 버튼
- 취소 버튼
- 기존 삭제 버튼

## 생성 우선순위

1. Figma 파일 생성
2. 페이지 생성
3. 디자인 토큰 시각화
4. 컴포넌트 생성
5. 화면 프레임 생성
6. 생성 결과 검토

## Todo 메모 확장 반영

Figma 파일에 다음 상태를 추가했다.

Components:

- `Todo Item / with note`
- `Todo Item / note editing`

Screens:

- `05 메모 있는 상태`
- `06 메모 편집 상태`

검증한 대표 노드:

- `Todo Components`: node `13:7`
- `05 메모 있는 상태`: node `55:25`
- `06 메모 편집 상태`: node `55:64`

검증 기준:

- Todo note는 제목 아래 `x=44`, `y=52`, `width=264`, `height=36`으로 배치한다.
- Note textarea는 `x=44`, `y=52`, `width=264`, `height=66`으로 배치한다.
- 메모 버튼은 `x=212`, 삭제 버튼은 `x=264`에 배치해 44x28 크기를 유지한다.
- 메모 편집 상태의 저장 버튼은 `x=212`, 취소 버튼은 `x=264`, `y=128`에 배치한다.
- Screens의 Todo list는 확장된 Todo Item 높이에 맞춰 다음 항목을 아래로 재배치한다.
