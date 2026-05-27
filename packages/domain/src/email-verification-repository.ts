import type { EmailVerification, EmailVerificationPurpose } from "./email-verification";

export interface EmailVerificationRepository {
  findLatestByEmailAndPurpose(
    email: string,
    purpose: EmailVerificationPurpose,
  ): Promise<EmailVerification | null>;
  create(emailVerification: EmailVerification): Promise<void>;
  update(emailVerification: EmailVerification): Promise<void>;
}
