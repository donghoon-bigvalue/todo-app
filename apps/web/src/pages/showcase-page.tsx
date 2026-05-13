import { Button, Checkbox, TextInput } from "../shared/ui";

export function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 text-[#1F2937]">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Showcase</h1>
          <p className="text-sm text-[#6B7280]">Todo App 디자인 시스템 컴포넌트</p>
        </header>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Button</h2>
            <p className="mt-1 text-sm text-[#6B7280]">할 일 추가와 삭제 동작에 사용한다.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button>기본</Button>
            <Button variant="accent">추가</Button>
            <Button variant="danger">삭제</Button>
            <Button disabled>비활성</Button>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Text Input</h2>
            <p className="mt-1 text-sm text-[#6B7280]">할 일을 입력할 때 사용한다.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold" htmlFor="showcase-text-input-default">
                기본
              </label>
              <TextInput id="showcase-text-input-default" placeholder="할 일을 입력하세요" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold" htmlFor="showcase-text-input-error">
                에러
              </label>
              <TextInput
                aria-invalid
                id="showcase-text-input-error"
                placeholder="할 일을 입력하세요"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Checkbox</h2>
            <p className="mt-1 text-sm text-[#6B7280]">할 일 완료 상태를 변경할 때 사용한다.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Checkbox label="미체크" />
            <Checkbox checked label="체크" readOnly />
          </div>
        </section>
      </div>
    </main>
  );
}
