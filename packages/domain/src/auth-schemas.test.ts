import { describe, expect, it } from "vitest";
import {
  MAX_LOGIN_ID_LENGTH,
  MAX_NICKNAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_LOGIN_ID_LENGTH,
  MIN_NICKNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  loginIdSchema,
  nicknameSchema,
  passwordSchema,
  signupSchema,
  userEmailSchema,
} from "./auth-schemas";

describe("auth schemas", () => {
  it("로그인 ID 앞뒤 공백을 제거하고 허용 문자를 검증한다", () => {
    expect(loginIdSchema.parse("  todo_user-1  ")).toBe("todo_user-1");
  });

  it("로그인 ID 길이와 허용 문자를 벗어나면 거부한다", () => {
    expect(loginIdSchema.safeParse("a".repeat(MIN_LOGIN_ID_LENGTH - 1)).success).toBe(false);
    expect(loginIdSchema.safeParse("a".repeat(MAX_LOGIN_ID_LENGTH + 1)).success).toBe(false);
    expect(loginIdSchema.safeParse("todo user").success).toBe(false);
  });

  it("닉네임 앞뒤 공백과 연속 공백을 정리한다", () => {
    expect(nicknameSchema.parse("  도훈   사용자  ")).toBe("도훈 사용자");
  });

  it("닉네임 길이를 검증한다", () => {
    expect(nicknameSchema.safeParse("가".repeat(MIN_NICKNAME_LENGTH - 1)).success).toBe(false);
    expect(nicknameSchema.safeParse("가".repeat(MAX_NICKNAME_LENGTH + 1)).success).toBe(false);
  });

  it("이메일 앞뒤 공백을 제거하고 소문자로 정리한다", () => {
    expect(userEmailSchema.parse("  USER@Example.COM  ")).toBe("user@example.com");
  });

  it("비밀번호 길이를 검증한다", () => {
    expect(passwordSchema.parse("password1")).toBe("password1");
    expect(passwordSchema.safeParse("a".repeat(MIN_PASSWORD_LENGTH - 1)).success).toBe(false);
    expect(passwordSchema.safeParse("a".repeat(MAX_PASSWORD_LENGTH + 1)).success).toBe(false);
  });

  it("회원가입 입력에서 비밀번호 확인 일치를 검증한다", () => {
    expect(
      signupSchema.parse({
        loginId: "todo_user",
        nickname: "도훈",
        email: "user@example.com",
        password: "password1",
        passwordConfirm: "password1",
      }),
    ).toEqual({
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      password: "password1",
      passwordConfirm: "password1",
    });

    expect(
      signupSchema.safeParse({
        loginId: "todo_user",
        nickname: "도훈",
        email: "user@example.com",
        password: "password1",
        passwordConfirm: "password2",
      }).success,
    ).toBe(false);
  });
});
