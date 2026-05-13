import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("조건부 className을 조합한다", () => {
    expect(cn("base", false && "hidden", "active")).toBe("base active");
  });

  it("충돌하는 Tailwind className은 뒤의 값을 우선한다", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
