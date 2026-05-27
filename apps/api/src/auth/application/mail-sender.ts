import type { EmailVerificationPurpose } from "@todo-app/domain";

export type SendEmailVerificationCodeInput = {
  readonly to: string;
  readonly code: string;
  readonly purpose: EmailVerificationPurpose;
};

export interface MailSender {
  sendEmailVerificationCode(input: SendEmailVerificationCodeInput): Promise<void>;
}

export class MailSendFailedError extends Error {
  constructor(
    readonly to: string,
    options?: ErrorOptions,
  ) {
    super(`메일 발송에 실패했습니다: ${to}`, options);
    this.name = "MailSendFailedError";
  }
}
