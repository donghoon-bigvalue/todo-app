import { expect, test } from "@playwright/test";

test.describe("E2E smoke", () => {
  test("API와 Web 앱이 함께 실행된다", async ({ page, request }) => {
    const healthResponse = await request.get("http://127.0.0.1:3000/health");

    expect(healthResponse.ok()).toBe(true);
    await expect(healthResponse.json()).resolves.toEqual({ status: "ok" });

    await page.goto("/");

    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
    await expect(page.getByLabel("로그인 ID")).toBeVisible();
  });
});
