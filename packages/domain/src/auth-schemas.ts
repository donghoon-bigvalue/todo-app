import { z } from "zod";

export const MIN_LOGIN_ID_LENGTH = 4;
export const MAX_LOGIN_ID_LENGTH = 30;
export const MIN_NICKNAME_LENGTH = 2;
export const MAX_NICKNAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 100;

export const loginIdSchema = z
  .string()
  .transform((loginId) => loginId.trim())
  .pipe(
    z
      .string()
      .min(MIN_LOGIN_ID_LENGTH, `로그인 ID는 ${MIN_LOGIN_ID_LENGTH}자 이상 입력해 주세요.`)
      .max(MAX_LOGIN_ID_LENGTH, `로그인 ID는 ${MAX_LOGIN_ID_LENGTH}자 이내로 입력해 주세요.`)
      .regex(/^[A-Za-z0-9_-]+$/, "로그인 ID는 영문, 숫자, _, -만 사용할 수 있습니다."),
  );

export const nicknameSchema = z
  .string()
  .transform((nickname) => nickname.trim().replace(/\s+/g, " "))
  .pipe(
    z
      .string()
      .min(MIN_NICKNAME_LENGTH, `닉네임은 ${MIN_NICKNAME_LENGTH}자 이상 입력해 주세요.`)
      .max(MAX_NICKNAME_LENGTH, `닉네임은 ${MAX_NICKNAME_LENGTH}자 이내로 입력해 주세요.`),
  );

export const userEmailSchema = z
  .string()
  .transform((email) => email.trim().toLowerCase())
  .pipe(z.string().email("이메일 형식을 확인해 주세요."));

export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상 입력해 주세요.`)
  .max(MAX_PASSWORD_LENGTH, `비밀번호는 ${MAX_PASSWORD_LENGTH}자 이내로 입력해 주세요.`);

export const signupSchema = z
  .object({
    loginId: loginIdSchema,
    nickname: nicknameSchema,
    email: userEmailSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((input) => input.password === input.passwordConfirm, {
    message: "비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });
