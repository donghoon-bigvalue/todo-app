---
name: git-conventional-commits
description: Use for this project when writing, suggesting, reviewing, or validating commit messages that follow Conventional Commits with English type and optional scope, and Korean summaries.
---

# Git Conventional Commits

커밋 메시지는 Conventional Commits 형식을 따르되, 설명은 한국어로 작성한다.

## 형식

```text
type(scope): 한국어 요약
```

`scope`는 선택 사항이다.

## 자주 쓰는 type

- `docs`: 문서 변경
- `feat`: 사용자에게 보이는 기능 추가
- `fix`: 버그 수정
- `test`: 테스트 추가 또는 수정
- `refactor`: 동작을 바꾸지 않는 구조 개선
- `chore`: 설정, 의존성, 빌드 등 유지보수 작업
- `style`: 포맷팅 또는 시각적 스타일 변경

## 작성 규칙

- `type`은 영어로 작성한다.
- `scope`는 코드나 문서의 영역을 영어로 작성한다.
- 요약은 한국어로 작성한다.
- 요약 끝에 마침표를 붙이지 않는다.
- 한 커밋에는 하나의 의도를 담는다.

## 예시

```text
docs: 초기 제품 기획서 추가
docs(product): 완료 항목 표시 방식 문서화
feat(todo): 할 일 추가 기능 구현
test(todo): 빈 제목으로 할 일을 만들 수 없음을 검증
refactor(todo): 완료 상태 변경 로직 분리
chore: TypeScript 설정 추가
```
