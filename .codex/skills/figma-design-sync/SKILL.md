---
name: figma-design-sync
description: Use for this project when creating, updating, or reviewing Figma designs from local product, requirements, user-flow, design-brief, or figma-plan documents. Focuses on cautious Figma MCP workflow, component-to-screen consistency, auto layout pitfalls, and metadata-based verification after visual edits.
---

# Figma Design Sync

이 skill은 문서 기반 Figma 작업을 할 때 사용한다.

목표는 한 번에 많은 요소를 그리는 것이 아니라, 기준 컴포넌트와 화면 상태가 서로 어긋나지 않도록 작게 만들고 검증하는 것이다.

## 작업 순서

1. 관련 문서를 먼저 읽는다.
   - `docs/product-brief.md`
   - `docs/requirements.md`
   - `docs/user-flow.md`
   - `docs/design-brief.md`
   - `docs/figma-plan.md`
2. Figma 파일 구조와 대상 노드를 확인한다.
3. 먼저 Components 페이지의 기준 컴포넌트를 수정한다.
4. Screens 페이지가 컴포넌트 instance인지 단순 복제 프레임인지 확인한다.
5. 단순 복제 프레임이면 Screens도 별도로 동기화한다.
6. 수정 후 대표 노드 metadata를 다시 읽어 좌표와 크기를 검증한다.
7. 사용자가 보는 시각적 어색함은 수치 검증과 별개로 피드백을 받는다.

## 주의할 점

- Components를 고쳤다고 Screens가 자동으로 바뀐다고 가정하지 않는다.
- Figma MCP에서 `page.findAll`이 항상 기대대로 대상을 잡는다고 가정하지 않는다.
- 특정 링크가 있으면 URL의 `node-id`를 우선 사용한다.
- 넓은 범위를 한 번에 수정하기보다, 대표 노드 하나를 고치고 검증한 뒤 같은 패턴을 확장한다.
- auto layout 설정 후에도 기존 좌표나 text auto resize 때문에 시각 정렬이 어긋날 수 있다.

## 정렬 검증 기준

Text Input 예시:

```text
Field height: 48
placeholder height: 18
expected placeholder y: 15
```

Todo row 예시:

```text
Todo content height: 28
Checkbox height: 20
expected checkbox y: 4

Todo text height: 22
expected text y: 3
```

Empty State 예시:

```text
Frame width: 342
horizontal padding: 24
text width: 294
textAlignHorizontal: CENTER
```

## Figma 수정 후 확인

수정이 끝나면 반드시 대표 노드에 대해 `get_metadata`를 호출해 확인한다.

확인할 항목:

- 대상 노드가 실제로 존재하는가
- 예상한 자식 노드가 남아 있는가
- `x`, `y`, `width`, `height`가 기준과 맞는가
- Components와 Screens가 같은 기준으로 맞춰졌는가
- 제거하기로 한 상태나 문구가 Figma에 남아 있지 않은가

## 작업 보고

Figma 작업 후에는 다음을 한국어로 요약한다.

- 수정한 Figma 페이지 또는 노드
- 기준으로 삼은 문서
- metadata로 검증한 대표 노드
- 남은 시각 검토 항목
