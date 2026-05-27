export type SmtpMailConfig = {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly auth?: {
    readonly user: string;
    readonly pass: string;
  };
  readonly from: string;
};

export class SmtpMailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmtpMailConfigError";
  }
}

export function createSmtpMailConfig(env: NodeJS.ProcessEnv): SmtpMailConfig {
  const host = readRequiredEnv(env, "SMTP_HOST");
  const port = Number(readRequiredEnv(env, "SMTP_PORT"));
  const from = readRequiredEnv(env, "SMTP_FROM");

  if (!Number.isInteger(port) || port <= 0) {
    throw new SmtpMailConfigError("SMTP_PORT는 양의 정수여야 합니다.");
  }

  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS?.trim();

  return {
    host,
    port,
    secure: env.SMTP_SECURE === "true",
    ...(user && pass
      ? {
          auth: {
            user,
            pass,
          },
        }
      : {}),
    from,
  };
}

function readRequiredEnv(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key]?.trim();

  if (!value) {
    throw new SmtpMailConfigError(`${key} 환경변수가 필요합니다.`);
  }

  return value;
}
