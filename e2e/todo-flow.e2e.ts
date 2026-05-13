import { expect, test } from "@playwright/test";

test.describe("Todo 핵심 사용자 흐름", () => {
  test("Todo를 추가하고 완료 상태를 바꾼 뒤 삭제한다", async ({ page }) => {
    const title = `E2E 할 일 ${Date.now()}`;

    await page.goto("/");

    await page.getByRole("textbox", { name: "할 일" }).fill(title);
    await page.getByRole("button", { name: "추가" }).click();

    const todoText = page.getByText(title, { exact: true });
    await expect(todoText).toBeVisible();
    await expect(page.getByRole("textbox", { name: "할 일" })).toHaveValue("");
    await expect(page.getByRole("checkbox", { name: `${title} 완료 처리` })).not.toBeChecked();

    await page.getByRole("checkbox", { name: `${title} 완료 처리` }).click();

    await expect(page.getByRole("checkbox", { name: `${title} 완료 취소` })).toBeChecked();
    await expect(todoText).toHaveClass(/line-through/);

    await page.getByRole("checkbox", { name: `${title} 완료 취소` }).click();

    await expect(page.getByRole("checkbox", { name: `${title} 완료 처리` })).not.toBeChecked();
    await expect(todoText).not.toHaveClass(/line-through/);

    await page.getByRole("button", { name: `${title} 삭제` }).click();

    await expect(todoText).not.toBeVisible();
  });
});
