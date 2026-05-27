import { describe, expect, it } from "vitest";
import { BcryptPasswordHasher } from "./bcrypt-password-hasher";

describe("BcryptPasswordHasher", () => {
  it("비밀번호를 bcrypt hash로 저장하고 검증한다", async () => {
    const hasher = new BcryptPasswordHasher(4);

    const passwordHash = await hasher.hash("password1");

    expect(passwordHash).not.toBe("password1");
    await expect(hasher.verify("password1", passwordHash)).resolves.toBe(true);
    await expect(hasher.verify("wrong", passwordHash)).resolves.toBe(false);
  });
});
