import nodemailer, { type SendMailOptions } from "nodemailer";
import {
  type MailSender,
  MailSendFailedError,
  type SendEmailVerificationCodeInput,
} from "../application/mail-sender";
import type { SmtpMailConfig } from "./smtp-mail-config";

export type NodemailerTransporter = {
  sendMail(message: SendMailOptions): Promise<unknown>;
};

export type NodemailerMailSenderOptions = {
  readonly from: string;
};

export class NodemailerMailSender implements MailSender {
  constructor(
    private readonly transporter: NodemailerTransporter,
    private readonly options: NodemailerMailSenderOptions,
  ) {}

  async sendEmailVerificationCode(input: SendEmailVerificationCodeInput): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.options.from,
        to: input.to,
        subject: createEmailVerificationSubject(input.purpose),
        text: createEmailVerificationText(input),
      });
    } catch (error) {
      throw new MailSendFailedError(input.to, { cause: error });
    }
  }
}

export function createNodemailerMailSender(config: SmtpMailConfig): NodemailerMailSender {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  return new NodemailerMailSender(transporter, {
    from: config.from,
  });
}

function createEmailVerificationSubject(
  purpose: SendEmailVerificationCodeInput["purpose"],
): string {
  if (purpose === "find-login-id") {
    return "[Todo App] 아이디 찾기 인증 코드";
  }

  return "[Todo App] 비밀번호 재설정 인증 코드";
}

function createEmailVerificationText(input: SendEmailVerificationCodeInput): string {
  const purposeText = input.purpose === "find-login-id" ? "아이디 찾기" : "비밀번호 재설정";

  return [
    `Todo App ${purposeText} 인증 코드입니다.`,
    "",
    `인증 코드: ${input.code}`,
    "",
    "본인이 요청하지 않았다면 이 메일을 무시해 주세요.",
  ].join("\n");
}
