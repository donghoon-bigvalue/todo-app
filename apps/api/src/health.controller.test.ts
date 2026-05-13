import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { HealthController } from "./health.controller";

describe("HealthController 상태 확인", () => {
  it("API 상태가 정상임을 반환한다", async () => {
    const module = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();
    const controller = module.get(HealthController);

    expect(controller.getHealth()).toEqual({ status: "ok" });
  });
});
