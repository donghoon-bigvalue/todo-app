import type { SendMailOptions } from "nodemailer";
import { describe, expect, it } from "vitest";
import { MailSendFailedError } from "../application/mail-sender";
import { NodemailerMailSender, type NodemailerTransporter } from "./nodemailer-mail-sender";

describe("NodemailerMailSender", () => {
  it("비밀번호 재설정 이메일 인증 코드를 발송한다", async () => {
    const sentMessages: SendMailOptions[] = [];
    const sender = new NodemailerMailSender(createFakeTransporter(sentMessages), {
      from: "Todo App <no-reply@example.com>",
    });

    await sender.sendEmailVerificationCode({
      to: "user@example.com",
      code: "123456",
      purpose: "reset-password",
    });

    expect(sentMessages).toEqual([
      expect.objectContaining({
        from: "Todo App <no-reply@example.com>",
        to: "user@example.com",
        subject: "[Todo App] 비밀번호 재설정 인증 코드",
      }),
    ]);
    expect(sentMessages[0]?.text).toContain("123456");
  });

  it("아이디 찾기 이메일 인증 코드를 발송한다", async () => {
    const sentMessages: SendMailOptions[] = [];
    const sender = new NodemailerMailSender(createFakeTransporter(sentMessages), {
      from: "Todo App <no-reply@example.com>",
    });

    await sender.sendEmailVerificationCode({
      to: "user@example.com",
      code: "654321",
      purpose: "find-login-id",
    });

    expect(sentMessages[0]).toMatchObject({
      subject: "[Todo App] 아이디 찾기 인증 코드",
    });
    expect(sentMessages[0]?.text).toContain("654321");
  });

  it("메일 발송 실패를 application 계층에서 다룰 수 있는 에러로 변환한다", async () => {
    const sender = new NodemailerMailSender(
      {
        async sendMail(): Promise<unknown> {
          throw new Error("SMTP connection failed");
        },
      },
      {
        from: "Todo App <no-reply@example.com>",
      },
    );

    await expect(
      sender.sendEmailVerificationCode({
        to: "user@example.com",
        code: "123456",
        purpose: "reset-password",
      }),
    ).rejects.toThrow(MailSendFailedError);
  });
});

function createFakeTransporter(sentMessages: SendMailOptions[]): NodemailerTransporter {
  return {
    async sendMail(message: SendMailOptions): Promise<unknown> {
      sentMessages.push(message);
      return { accepted: [message.to], rejected: [] };
    },
  };
}
