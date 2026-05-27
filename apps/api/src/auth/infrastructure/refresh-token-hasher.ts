import { createHash } from "node:crypto";
import type { RefreshTokenHasher } from "../application/auth-use-cases";

export class Sha256RefreshTokenHasher implements RefreshTokenHasher {
  hash(refreshToken: string): string {
    return createHash("sha256").update(refreshToken).digest("hex");
  }
}
