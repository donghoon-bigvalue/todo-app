// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createQueryClient } from "../app/query-client";
import { AuthGate } from "./auth-gate";

vi.mock("../shared/api", () => ({
  changePassword: vi.fn(),
  clearAccessToken: vi.fn(),
  deleteAccount: vi.fn(),
  getAccessToken: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  refreshAccessToken: vi.fn(),
  requestFindLoginIdCode: vi.fn(),
  requestPasswordResetCode: vi.fn(),
  resetPassword: vi.fn(),
  signup: vi.fn(),
  verifyFindLoginIdCode: vi.fn(),
  createTodo: vi.fn(),
  deleteTodo: vi.fn(),
  listTodos: vi.fn(),
  updateTodoCompleted: vi.fn(),
  updateTodoNote: vi.fn(),
}));

const {
  changePassword,
  deleteAccount,
  getAccessToken,
  login,
  listTodos,
  logout,
  refreshAccessToken,
  requestFindLoginIdCode,
  requestPasswordResetCode,
  resetPassword,
  signup,
  verifyFindLoginIdCode,
} = await import("../shared/api");

function renderAuthGate() {
  render(
    <QueryClientProvider client={createQueryClient()}>
      <AuthGate />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe("AuthGate", () => {
  it("미로그인 사용자는 로그인 화면을 본다", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("refresh failed"));

    renderAuthGate();

    expect(await screen.findByRole("heading", { name: "로그인" })).toBeInTheDocument();
  });

  it("로그인하면 Todo 화면으로 이동한다", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("refresh failed"));
    vi.mocked(login).mockResolvedValue({
      accessToken: "access-token",
      user: {
        id: "user-1",
        loginId: "todo_user",
        nickname: "도훈",
        email: "user@example.com",
      },
    });
    vi.mocked(listTodos).mockResolvedValue([]);

    renderAuthGate();
    await userEvent.type(await screen.findByLabelText("로그인 ID"), "todo_user");
    await userEvent.type(screen.getByLabelText("비밀번호"), "password1");
    await userEvent.click(screen.getAllByRole("button", { name: "로그인" }).at(-1) as HTMLElement);

    expect(await screen.findByRole("heading", { name: "할 일 체크리스트" })).toBeInTheDocument();
  });

  it("회원가입 후 Todo 화면으로 이동한다", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("refresh failed"));
    vi.mocked(signup).mockResolvedValue({
      id: "user-1",
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      createdAt: "2026-05-27T08:00:00.000Z",
    });
    vi.mocked(login).mockResolvedValue({
      accessToken: "access-token",
      user: {
        id: "user-1",
        loginId: "todo_user",
        nickname: "도훈",
        email: "user@example.com",
      },
    });
    vi.mocked(listTodos).mockResolvedValue([]);

    renderAuthGate();
    await userEvent.click(await screen.findByRole("button", { name: "회원가입" }));
    await userEvent.type(screen.getByLabelText("로그인 ID"), "todo_user");
    await userEvent.type(screen.getByLabelText("닉네임"), "도훈");
    await userEvent.type(screen.getByLabelText("이메일"), "user@example.com");
    await userEvent.type(screen.getByLabelText("비밀번호"), "password1");
    await userEvent.type(screen.getByLabelText("비밀번호 확인"), "password1");
    await userEvent.click(screen.getByRole("button", { name: "계정 만들기" }));

    expect(signup).toHaveBeenCalled();
    expect(await screen.findByRole("heading", { name: "할 일 체크리스트" })).toBeInTheDocument();
  });

  it("로그아웃하면 로그인 화면으로 돌아간다", async () => {
    vi.mocked(getAccessToken).mockReturnValue("access-token");
    vi.mocked(listTodos).mockResolvedValue([]);
    vi.mocked(logout).mockResolvedValue(undefined);
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("refresh failed"));

    renderAuthGate();
    await userEvent.click(await screen.findByRole("button", { name: "로그아웃" }));

    expect(await screen.findByRole("heading", { name: "로그인" })).toBeInTheDocument();
  });

  it("이메일 인증으로 로그인 ID를 찾는다", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("refresh failed"));
    vi.mocked(requestFindLoginIdCode).mockResolvedValue(undefined);
    vi.mocked(verifyFindLoginIdCode).mockResolvedValue({ loginId: "todo_user" });

    renderAuthGate();
    await userEvent.click(await screen.findByRole("button", { name: "아이디 찾기" }));
    await userEvent.type(screen.getByLabelText("이메일"), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: "인증 코드 발송" }));
    await userEvent.type(screen.getByLabelText("인증 코드"), "333333");
    await userEvent.click(screen.getByRole("button", { name: "로그인 ID 확인" }));

    expect(requestFindLoginIdCode).toHaveBeenCalledWith({ email: "user@example.com" });
    expect(verifyFindLoginIdCode).toHaveBeenCalledWith({
      email: "user@example.com",
      code: "333333",
    });
    expect(await screen.findByText("로그인 ID: todo_user")).toBeInTheDocument();
  });

  it("이메일 인증으로 비밀번호를 재설정한다", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("refresh failed"));
    vi.mocked(requestPasswordResetCode).mockResolvedValue(undefined);
    vi.mocked(resetPassword).mockResolvedValue(undefined);

    renderAuthGate();
    await userEvent.click(await screen.findByRole("button", { name: "비밀번호 재설정" }));
    await userEvent.type(screen.getByLabelText("이메일"), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: "인증 코드 발송" }));
    await userEvent.type(screen.getByLabelText("인증 코드"), "333333");
    await userEvent.type(screen.getByLabelText("새 비밀번호"), "new-password1");
    await userEvent.type(screen.getByLabelText("새 비밀번호 확인"), "new-password1");
    await userEvent.click(screen.getByRole("button", { name: "비밀번호 변경" }));

    expect(requestPasswordResetCode).toHaveBeenCalledWith({ email: "user@example.com" });
    expect(resetPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      code: "333333",
      password: "new-password1",
      passwordConfirm: "new-password1",
    });
    expect(await screen.findByText("비밀번호가 변경되었습니다.")).toBeInTheDocument();
  });

  it("로그인 후 비밀번호를 변경하면 로그인 화면으로 돌아간다", async () => {
    vi.mocked(getAccessToken).mockReturnValue("access-token");
    vi.mocked(listTodos).mockResolvedValue([]);
    vi.mocked(changePassword).mockResolvedValue(undefined);
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("refresh failed"));

    renderAuthGate();
    await userEvent.click(await screen.findByRole("button", { name: "계정 관리" }));
    await userEvent.type(screen.getByLabelText("현재 비밀번호"), "password1");
    await userEvent.type(screen.getByLabelText("새 비밀번호"), "new-password1");
    await userEvent.type(screen.getByLabelText("새 비밀번호 확인"), "new-password1");
    await userEvent.click(screen.getByRole("button", { name: "비밀번호 변경" }));

    expect(changePassword).toHaveBeenCalledWith({
      currentPassword: "password1",
      password: "new-password1",
      passwordConfirm: "new-password1",
    });
    expect(await screen.findByRole("heading", { name: "로그인" })).toBeInTheDocument();
  });

  it("회원탈퇴 후 로그인 화면으로 돌아간다", async () => {
    vi.mocked(getAccessToken).mockReturnValue("access-token");
    vi.mocked(listTodos).mockResolvedValue([]);
    vi.mocked(deleteAccount).mockResolvedValue(undefined);
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("refresh failed"));

    renderAuthGate();
    await userEvent.click(await screen.findByRole("button", { name: "계정 관리" }));
    await userEvent.type(screen.getByLabelText("탈퇴 확인 비밀번호"), "password1");
    await userEvent.click(screen.getByRole("button", { name: "회원탈퇴" }));

    expect(deleteAccount).toHaveBeenCalledWith({ password: "password1" });
    expect(await screen.findByRole("heading", { name: "로그인" })).toBeInTheDocument();
  });
});
