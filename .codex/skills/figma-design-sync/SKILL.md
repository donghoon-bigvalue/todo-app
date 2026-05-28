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
2. Figma 파일 구조와 대상 노드를 read-only로 확인한다.
3. 쓰기 작업 전에 inventory를 사용자에게 보고한다.
4. 기존 디자인 토큰, 컴포넌트, 화면 스타일을 기준으로 새 작업 계획을 정리한다.
5. 먼저 Components 페이지의 기준 컴포넌트를 확장한다.
6. Screens 페이지가 컴포넌트 instance인지 단순 복제 프레임인지 확인한다.
7. 단순 복제 프레임이면 Screens도 별도로 동기화한다.
8. 수정 후 대표 노드 metadata를 다시 읽어 좌표와 크기를 검증한다.
9. 사용자가 보는 시각적 어색함은 수치 검증과 별개로 피드백을 받는다.

## 코드 UI 구현 전 게이트

Figma에 이미 기준 화면이나 컴포넌트가 있는 UI를 코드로 구현하거나 수정할 때는 다음을 작업 착수 조건으로 본다.

- 코드 작성 전에 Figma URL 또는 node id를 확인한다.
- 대상 node의 `get_design_context` 또는 `get_metadata`를 먼저 읽는다.
- 화면 fidelity가 중요한 경우 `get_screenshot`도 확인한다.
- 참고한 Figma node와 구현할 코드 파일/화면의 대응 관계를 작업 계획에 남긴다.
- Figma와 다르게 구현할 부분이 있으면 사용자에게 먼저 차이와 이유를 설명한다.
- Figma 확인을 건너뛸 수 있는 경우는 사용자가 명시적으로 승인한 경우뿐이다.

코드 UI 작업 완료 보고에는 다음을 포함한다.

- 참고한 Figma URL 또는 node id
- 구현한 코드 화면과 Figma 화면의 대응 관계
- Figma 기준과 다르게 구현한 부분
- component test, screenshot, E2E 등 시각/행동 정합성 검증 방법

## 쓰기 전 필수 inventory

Figma에 쓰기 작업을 하기 전에는 반드시 read-only 단계로 다음을 확인한다.

- 현재 file key와 문서의 file key가 일치하는가
- top-level page 목록
- 각 page의 주요 child frame 이름과 node id
- 수정 또는 추가 대상 page와 node id
- 기존 Components와 Screens가 instance 연결인지 단순 복제인지
- 새 화면이 기존 화면 옆에 추가될 위치

inventory 확인 전에는 `use_figma`로 쓰기 작업을 하지 않는다.

inventory 결과에서 문서와 실제 Figma 구조가 다르면 쓰기 작업을 멈추고 사용자에게 먼저 보고한다.

## Figma 안전 규칙

기존 디자인을 보존하는 것이 최우선이다.

다음 작업은 사용자에게 별도 승인을 받기 전까지 금지한다.

- page 전체 비우기
- 기존 frame 전체 삭제
- 기존 component 삭제
- 기존 screen 삭제
- 기존 node 대량 이동
- 기존 page/frame/component 이름 변경
- `clearPage(...)` 사용
- 기존 노드에 대한 `remove()` 사용

새 컴포넌트나 화면을 만들 때는 기본적으로 기존 page 안의 끝 영역 또는 별도 section에 추가한다. 기존 화면 위에 덮어쓰지 않는다.

기존 노드를 수정해야 하는 경우에는 수정 대상 node id, 수정 이유, 되돌릴 수 있는 기준을 먼저 보고한다.

## 배치 충돌 방지 규칙

새 section, component group, screen group, 화면 frame을 추가하거나 이동할 때는 기존 sibling node와 겹치지 않는 좌표를 먼저 계산해야 한다.

쓰기 작업 전:

- 같은 page 또는 같은 section의 주요 sibling node id, `x`, `y`, `width`, `height`를 inventory로 확인한다.
- 기존 row 또는 column의 간격을 계산한다. Screens처럼 반복 frame이면 기존 간격을 우선한다.
- 새 영역은 기존 sibling bounding box와 겹치지 않는 다음 slot에 배치한다.
- 기존 간격을 알 수 없으면 최소 gutter는 screen frame 사이 `40px`, 큰 section 사이 `80px`로 둔다.
- page title 또는 page intro frame 아래에 첫 content section을 둘 때는 title frame 하단과 첫 section 상단 사이를 최소 `56px` 이상으로 둔다.

쓰기 작업 후:

- `get_metadata`로 이동한 대표 node의 `x`, `y`, `width`, `height`를 다시 확인한다.
- 같은 parent 안의 sibling bounding box와 겹치지 않는지 확인한다.
- row 배치인 경우 기준 row의 `y`가 맞는지 확인한다.
- page title 아래 첫 content section을 이동했으면 title frame 하단과 첫 section 상단 사이가 최소 `56px`인지 확인한다.
- 겹침 또는 기준 row 이탈이 남아 있으면 Figma 작업을 완료로 보고하지 않는다.

## 기존 스타일 유지 규칙

새 컴포넌트나 화면은 기존 디자인 시스템의 시각 언어를 유지해야 한다.

쓰기 작업 전 다음 기준을 먼저 확인하고 재사용한다.

- 기존 색상 토큰
- 기존 typography 크기와 weight
- 기존 spacing 간격
- 기존 radius
- 기존 Button, Text Input, Checkbox, Todo Item의 크기와 상태 표현
- 기존 화면 width, padding, section 간격
- 기존 문구 톤과 label 방식

새 스타일을 임의로 만들지 않는다.

새 상태가 필요하면 기존 컴포넌트를 복제해 variant처럼 확장한다. 색상, radius, typography, padding은 기존 토큰과 같은 계열을 사용한다.

기존 디자인과 다르게 보이는 새 패턴이 필요하면 먼저 사용자에게 이유와 대안을 제시한다.

## 주의할 점

- Components를 고쳤다고 Screens가 자동으로 바뀐다고 가정하지 않는다.
- Figma 작업은 추가/확장을 기본으로 하고, 삭제/재생성은 예외로 다룬다.
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
- 새로 추가하거나 이동한 section/frame이 sibling node와 겹치지 않는가
- 반복 화면 row의 `y` 좌표와 frame 간격이 기존 화면들과 맞는가
- Components와 Screens가 같은 기준으로 맞춰졌는가
- 제거하기로 한 상태나 문구가 Figma에 남아 있지 않은가

## 작업 보고

Figma 작업 후에는 다음을 한국어로 요약한다.

- 수정한 Figma 페이지 또는 노드
- 기준으로 삼은 문서
- 재사용한 기존 디자인 토큰 또는 컴포넌트
- metadata로 검증한 대표 노드
- 삭제하거나 이름을 바꾼 기존 노드가 없는지 여부
- 남은 시각 검토 항목
