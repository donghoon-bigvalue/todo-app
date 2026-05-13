import { useQuery } from "@tanstack/react-query";
import { EmptyState, ErrorMessage, TodoItem } from "../shared/ui";
import { listTodos } from "../shared/api";

export function TodoPage() {
  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: () => listTodos(),
  });
  const todos = todosQuery.data ?? [];
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 text-[#1F2937]">
      <div className="mx-auto max-w-[390px] space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">할 일 체크리스트</h1>
          <p className="text-sm text-[#6B7280]">남은 할 일 {remainingCount}개</p>
        </header>

        <section aria-label="할 일 목록" className="space-y-3">
          {todosQuery.isLoading ? <p className="text-sm text-[#6B7280]">불러오는 중...</p> : null}
          {todosQuery.isError ? (
            <ErrorMessage>할 일 목록을 불러오지 못했습니다.</ErrorMessage>
          ) : null}
          {!todosQuery.isLoading && !todosQuery.isError && todos.length === 0 ? (
            <EmptyState />
          ) : null}
          {todos.map((todo) => (
            <TodoItem completed={todo.completed} key={todo.id} title={todo.title} />
          ))}
        </section>
      </div>
    </main>
  );
}
