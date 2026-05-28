# UI Task Checklist

이 문서는 UI 작업을 시작하고 완료할 때 Agent가 빠뜨리기 쉬운 항목을 강제로 확인하기 위한 체크리스트다.

대상 작업:

- 새 화면, 새 컴포넌트, 새 UI 상태, 새 interaction
- 기존 화면의 시각적 변경
- Figma `Components` 또는 `Screens` 페이지 수정
- shared UI 또는 `/showcase` 변경

## 1. 작업 전 Preflight

UI 작업을 시작하기 전에 다음 질문에 답한다.

- 이번 변경은 UI 작업인가?
- 참고할 Figma URL 또는 node id가 있는가?
- Figma의 `Components`, `Screens`, 또는 둘 다에 영향이 있는가?
- 새 컴포넌트, component group, variant, form control, reusable action이 생기는가?
- 기존 shared UI 컴포넌트나 variant로 해결할 수 있는가?
- `/showcase` 반영이 필요한가?
- 실제 화면이 shared UI를 재사용해야 하는가?
- Figma와 다르게 구현해야 하는 부분이 있는가?

하나라도 모호하면 구현 전에 사용자에게 확인한다.

## 2. Figma 확인

이미 Figma 기준이 있거나 Figma를 수정해야 하는 UI 작업은 다음을 확인한다.

- Figma file key와 작업 문서의 file key가 일치한다.
- 대상 node id를 확인했다.
- `get_design_context`, `get_metadata`, `get_screenshot` 중 필요한 read-only 확인을 먼저 수행했다.
- 참고한 Figma node와 구현할 코드 화면의 대응 관계를 작업 계획에 남겼다.
- Figma에 쓰기 작업을 한다면 기존 node 삭제, page 비우기, 대량 이동이 없는지 확인했다.
- 새 section/frame을 만들거나 이동한다면 sibling bounding box와 gutter를 확인했다.

## 3. Design System Gate

Figma `Components` 페이지에 새 컴포넌트, component group, variant, form control, reusable action이 생기거나 기존 컴포넌트 상태가 확장되면 다음을 먼저 완료한다.

- `apps/web/src/shared/ui`에 대응 컴포넌트 또는 variant를 만든다.
- 필요한 경우 component test를 추가한다.
- `/showcase`에 상태별 예시를 추가한다.
- `/showcase`에 실제 화면에서 쓰는 조합을 추가한다.
- 실제 화면은 shared UI 컴포넌트를 재사용한다.
- 화면 내부에 같은 UI가 inline duplicate로 남아 있지 않은지 확인한다.

이 gate를 통과하지 못하면 UI task는 완료로 보지 않는다.

## 4. 구현 전 Task Template

UI task를 실행하기 전에 다음 형식으로 범위를 정리한다.

```md
목표:

- 

참고 Figma:

- Components:
- Screens:

변경 예상 파일:

- Figma:
- shared UI:
- showcase:
- 실제 화면:
- test:
- docs:

완료 조건:

- Figma 기준 확인 또는 수정이 완료되어 있다.
- shared UI와 `/showcase` 반영 여부를 판단했다.
- 실제 화면은 shared UI를 재사용한다.
- 사용자 행동 중심 테스트가 있다.
- `npm run check`가 통과한다.

범위 밖:

- 
```

## 5. 완료 전 Audit

완료 보고 또는 커밋 전에 요구사항별로 증거를 확인한다.

- 사용자 요청의 각 항목이 실제 코드, Figma, 문서, 테스트 중 어디에서 충족되는지 확인했다.
- Figma node id 또는 URL을 완료 보고에 포함할 수 있다.
- Figma 기준과 다르게 구현한 부분이 있으면 이유를 설명할 수 있다.
- `/showcase`가 필요한 작업이면 showcase 경로 테스트 또는 component test로 노출을 확인했다.
- 실제 화면이 shared UI를 재사용하는지 파일에서 확인했다.
- `npm run check`가 통과했다.
- dev server나 watch process를 직접 띄웠다면 종료했거나 유지 이유를 보고한다.
- `docs/current-plan.md`와 `docs/task-log.md`가 현재 상태와 맞다.

위 항목 중 증거가 약하거나 누락된 항목이 있으면 완료로 보고하지 않는다.
