import { describe, expect, it } from "vitest";
import {
  EmailVerification,
  EmailVerificationAlreadyUsedError,
  EmailVerificationExpiredError,
  EmailVerificationInvalidCodeError,
  type EmailVerificationSnapshot,
  createEmailVerificationCode,
  createEmailVerificationId,
} from "./email-verification";

describe("EmailVerification", () => {
  it("이메일 인증 기록을 생성하고 인증 코드를 생성한다", () => {
    const createdAt = new Date("2026-05-27T08:00:00.000Z");
    const expiresAt = new Date("2026-05-27T08:10:00.000Z");
    const verification = EmailVerification.create({
      id: createEmailVerificationId("email-verification-1"),
      email: "user@example.com",
      code: createEmailVerificationCode(() => 3),
      purpose: "find-login-id",
      createdAt,
      expiresAt,
    });

    expect(verification.toSnapshot()).toEqual<EmailVerificationSnapshot>({
      id: createEmailVerificationId("email-verification-1"),
      email: "user@example.com",
      code: "333333",
      purpose: "find-login-id",
      usedAt: null,
      createdAt,
      expiresAt,
    });
  });

  it("유효한 인증 코드를 사용 처리한다", () => {
    const verification = createVerification();
    const usedAt = new Date("2026-05-27T08:05:00.000Z");

    verification.use({ code: "123456", usedAt });

    expect(verification.usedAt).toEqual(usedAt);
    expect(verification.isUsed()).toBe(true);
  });

  it("잘못된 인증 코드는 거부한다", () => {
    const verification = createVerification();

    expect(() =>
      verification.use({ code: "000000", usedAt: new Date("2026-05-27T08:05:00.000Z") }),
    ).toThrow(EmailVerificationInvalidCodeError);
  });

  it("만료된 인증 코드는 거부한다", () => {
    const verification = createVerification();

    expect(() =>
      verification.use({ code: "123456", usedAt: new Date("2026-05-27T08:11:00.000Z") }),
    ).toThrow(EmailVerificationExpiredError);
  });

  it("이미 사용한 인증 코드는 다시 사용할 수 없다", () => {
    const verification = createVerification();

    verification.use({ code: "123456", usedAt: new Date("2026-05-27T08:05:00.000Z") });

    expect(() =>
      verification.use({ code: "123456", usedAt: new Date("2026-05-27T08:06:00.000Z") }),
    ).toThrow(EmailVerificationAlreadyUsedError);
  });
});

function createVerification(): EmailVerification {
  return EmailVerification.create({
    id: createEmailVerificationId("email-verification-1"),
    email: "user@example.com",
    code: "123456",
    purpose: "reset-password",
    createdAt: new Date("2026-05-27T08:00:00.000Z"),
    expiresAt: new Date("2026-05-27T08:10:00.000Z"),
  });
}
