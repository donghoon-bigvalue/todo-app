import bcrypt from "bcryptjs";
import type { PasswordHasher } from "../application/auth-use-cases";

export const BCRYPT_PASSWORD_HASH_COST = 12;

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly cost = BCRYPT_PASSWORD_HASH_COST) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.cost);
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
