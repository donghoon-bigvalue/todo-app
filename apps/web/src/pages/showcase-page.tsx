import {
  Button,
  Checkbox,
  EmptyState,
  ErrorMessage,
  FormField,
  TextAction,
  TextInput,
  TodoItem,
} from "../shared/ui";

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
            <Button variant="primary">추가</Button>
            <Button variant="danger">삭제</Button>
            <Button disabled>비활성</Button>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Text Input</h2>
            <p className="mt-1 text-sm text-[#6B7280]">할 일을 입력할 때 사용한다.</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-semibold" htmlFor="showcase-text-input-default">
                기본
              </label>
              <TextInput id="showcase-text-input-default" placeholder="할 일을 입력하세요" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold" htmlFor="showcase-text-input-focus">
                포커스
              </label>
              <TextInput
                id="showcase-text-input-focus"
                placeholder="할 일을 입력하세요"
                state="focus"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold" htmlFor="showcase-text-input-error">
                에러
              </label>
              <TextInput
                aria-invalid
                id="showcase-text-input-error"
                placeholder="할 일을 입력하세요"
                state="error"
              />
              <p className="text-[13px] text-[#DC2626]">할 일을 입력해주세요.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Auth Form Controls</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              인증 화면에서 사용하는 입력, 비밀번호 표시 토글, 보조 액션 조합
            </p>
          </div>

          <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-[21px]">
            <div className="grid gap-[14px] lg:grid-cols-3">
              <FormField
                label="로그인 ID"
                onChange={() => undefined}
                placeholder="todo_user"
                value=""
              />
              <FormField
                label="비밀번호"
                onChange={() => undefined}
                placeholder="비밀번호"
                type="password"
                value=""
              />
              <FormField
                errorMessage="입력값을 확인해주세요."
                label="이메일"
                onChange={() => undefined}
                placeholder="name@example.com"
                value=""
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                className="h-7 rounded-[6px] text-[12px] leading-[17px]"
                size="sm"
                variant="primary"
              >
                로그인
              </Button>
              <Button className="h-7 rounded-[6px] text-[12px] leading-[17px]" size="sm">
                인증 코드 발송
              </Button>
              <Button
                className="h-7 rounded-[6px] text-[12px] leading-[17px]"
                size="sm"
                variant="dangerSoft"
              >
                회원탈퇴
              </Button>
              <TextAction onClick={() => undefined}>로그인으로 돌아가기</TextAction>
            </div>
          </div>

          <div className="w-full max-w-[342px] rounded-[8px] border border-[#E5E7EB] bg-white p-4">
            <div className="space-y-3">
              <FormField
                label="로그인 ID"
                onChange={() => undefined}
                placeholder="todo_user"
                value=""
              />
              <FormField
                label="비밀번호"
                onChange={() => undefined}
                placeholder="비밀번호"
                type="password"
                value=""
              />
              <Button
                className="h-7 w-full rounded-[6px] text-[12px] leading-[17px]"
                size="sm"
                variant="primary"
              >
                로그인
              </Button>
              <div className="mt-4 space-y-2">
                <TextAction onClick={() => undefined}>회원가입</TextAction>
                <TextAction onClick={() => undefined}>아이디 찾기</TextAction>
                <TextAction onClick={() => undefined}>비밀번호 재설정</TextAction>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Checkbox</h2>
            <p className="mt-1 text-sm text-[#6B7280]">할 일 완료 상태를 변경할 때 사용한다.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Checkbox hideLabel label="미체크" />
            <Checkbox checked hideLabel label="체크" readOnly />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Todo Item</h2>
            <p className="mt-1 text-sm text-[#6B7280]">할 일 항목의 상태별 표현</p>
          </div>

          <div className="flex flex-wrap items-start gap-6">
            <TodoItem completed={false} title="장보기" />
            <TodoItem completed title="이메일 답장하기" />
            <TodoItem
              completed={false}
              note="우유, 계란, 커피 원두를 확인하고 필요한 것만 사기"
              onNoteEdit={() => undefined}
              title="장보기"
            />
            <TodoItem
              completed={false}
              isNoteEditing
              note="우유, 계란, 커피 원두를 확인하고 필요한 것만 사기"
              noteDraft="우유, 계란, 커피 원두를 확인하고 필요한 것만 사기"
              onNoteCancel={() => undefined}
              onNoteChange={() => undefined}
              onNoteEdit={() => undefined}
              onNoteSave={() => undefined}
              title="장보기"
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Feedback</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              빈 상태와 입력 오류처럼 사용자에게 상태를 알려주는 요소
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-6">
            <EmptyState />
            <ErrorMessage>할 일을 입력해주세요.</ErrorMessage>
          </div>
        </section>
      </div>
    </main>
  );
}
