import { describe, expect, it } from "vitest";
import { User, type UserSnapshot, createUserId } from "./user";

describe("User", () => {
  it("회원가입에 필요한 사용자 정보를 생성한다", () => {
    const createdAt = new Date("2026-05-27T08:00:00.000Z");
    const user = User.create({
      id: createUserId("user-1"),
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      passwordHash: "hashed-password",
      createdAt,
    });

    expect(user.toSnapshot()).toEqual<UserSnapshot>({
      id: createUserId("user-1"),
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      passwordHash: "hashed-password",
      createdAt,
    });
  });

  it("기존 사용자 snapshot을 복원하고 비밀번호 hash를 변경한다", () => {
    const user = User.restore({
      id: createUserId("user-1"),
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      passwordHash: "old-hash",
      createdAt: new Date("2026-05-27T08:00:00.000Z"),
    });

    user.changePasswordHash("new-hash");

    expect(user.passwordHash).toBe("new-hash");
  });

  it("createdAt이 외부 변경의 영향을 받지 않게 보호한다", () => {
    const createdAt = new Date("2026-05-27T08:00:00.000Z");
    const user = User.create({
      id: createUserId("user-1"),
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      passwordHash: "hashed-password",
      createdAt,
    });

    createdAt.setFullYear(1999);
    const snapshot = user.toSnapshot();
    snapshot.createdAt.setFullYear(2000);

    expect(user.createdAt).toEqual(new Date("2026-05-27T08:00:00.000Z"));
  });
});
