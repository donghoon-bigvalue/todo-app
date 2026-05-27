import { describe, expect, it } from "vitest";
import { createSmtpMailConfig, SmtpMailConfigError } from "./smtp-mail-config";

describe("createSmtpMailConfig", () => {
  it("SMTP 환경변수를 mail sender 설정으로 변환한다", () => {
    expect(
      createSmtpMailConfig({
        SMTP_HOST: "smtp.example.com",
        SMTP_PORT: "465",
        SMTP_SECURE: "true",
        SMTP_USER: "smtp-user",
        SMTP_PASS: "smtp-pass",
        SMTP_FROM: "Todo App <no-reply@example.com>",
      }),
    ).toEqual({
      transport: "smtp",
      host: "smtp.example.com",
      port: 465,
      secure: true,
      auth: {
        user: "smtp-user",
        pass: "smtp-pass",
      },
      from: "Todo App <no-reply@example.com>",
    });
  });

  it("SMTP 인증 정보는 user와 pass가 모두 있을 때만 포함한다", () => {
    expect(
      createSmtpMailConfig({
        SMTP_HOST: "smtp.example.com",
        SMTP_PORT: "587",
        SMTP_FROM: "Todo App <no-reply@example.com>",
      }),
    ).toEqual({
      transport: "smtp",
      host: "smtp.example.com",
      port: 587,
      secure: false,
      from: "Todo App <no-reply@example.com>",
    });
  });

  it("필수 SMTP 환경변수가 없거나 port가 숫자가 아니면 거부한다", () => {
    expect(() => createSmtpMailConfig({})).toThrow(SmtpMailConfigError);
    expect(() =>
      createSmtpMailConfig({
        SMTP_HOST: "smtp.example.com",
        SMTP_PORT: "not-a-number",
        SMTP_FROM: "Todo App <no-reply@example.com>",
      }),
    ).toThrow(SmtpMailConfigError);
  });

  it("E2E에서는 stream transport를 사용할 수 있다", () => {
    expect(
      createSmtpMailConfig({
        SMTP_TRANSPORT: "stream",
        SMTP_FROM: "Todo App <no-reply@example.com>",
      }),
    ).toEqual({
      transport: "stream",
      from: "Todo App <no-reply@example.com>",
    });
  });
});
