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

- [Todo App](https://www.figma.com/design/LMJjjtgzzuwDDthcxS8p4I/Todo-App?node-id=4-2&p=f&m=dev)

페이지별 기준 node:

- [Cover](https://www.figma.com/design/LMJjjtgzzuwDDthcxS8p4I/Todo-App?node-id=4-2&p=f&m=dev)
- [Design System](https://www.figma.com/design/LMJjjtgzzuwDDthcxS8p4I/Todo-App?node-id=4-3&p=f&m=dev)
- [Components](https://www.figma.com/design/LMJjjtgzzuwDDthcxS8p4I/Todo-App?node-id=4-4&p=f&m=dev)
- [Screens](https://www.figma.com/design/LMJjjtgzzuwDDthcxS8p4I/Todo-App?node-id=4-5&p=f&m=dev)

Figma 컴포넌트를 코드로 옮길 때는 `Components` 페이지를 먼저 확인하고, 화면 구현을 할 때는 `Screens` 페이지를 기준으로 삼는다.

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

표현 기준:

- 미완료 항목은 일반 텍스트로 표시한다.
- 완료 항목은 낮은 강조도와 취소선으로 표시한다.

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

## 생성 우선순위

1. Figma 파일 생성
2. 페이지 생성
3. 디자인 토큰 시각화
4. 컴포넌트 생성
5. 화면 프레임 생성
6. 생성 결과 검토
