import { expect, test } from "@playwright/test";

test.describe("Todo 핵심 사용자 흐름", () => {
  test("Todo를 추가하고 완료 상태를 바꾼 뒤 삭제한다", async ({ page }) => {
    const title = `E2E 할 일 ${Date.now()}`;

    await page.goto("/");

    await page.getByRole("textbox", { name: "할 일" }).fill(title);
    await page.getByRole("button", { exact: true, name: "추가" }).click();

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

  test("Todo 메모를 추가, 수정, 비운다", async ({ page }) => {
    const title = `E2E 메모 할 일 ${Date.now()}`;

    await page.goto("/");

    await page.getByRole("textbox", { name: "할 일" }).fill(title);
    await page.getByRole("button", { exact: true, name: "추가" }).click();

    await expect(page.getByText(title, { exact: true })).toBeVisible();

    await page.getByRole("button", { name: `${title} 메모 추가` }).click();
    await page.getByRole("textbox", { name: `${title} 메모` }).fill("우유 확인");
    await page.getByRole("button", { name: `${title} 메모 저장` }).click();

    await expect(page.getByText("우유 확인", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: `${title} 메모 수정` }).click();
    await page.getByRole("textbox", { name: `${title} 메모` }).fill("우유와 계란 확인");
    await page.getByRole("button", { name: `${title} 메모 저장` }).click();

    await expect(page.getByText("우유와 계란 확인", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: `${title} 메모 수정` }).click();
    await page.getByRole("textbox", { name: `${title} 메모` }).fill("");
    await page.getByRole("button", { name: `${title} 메모 저장` }).click();

    await expect(page.getByText("우유와 계란 확인", { exact: true })).not.toBeVisible();
    await expect(page.getByRole("button", { name: `${title} 메모 추가` })).toBeVisible();
  });

  test("메모 편집은 한 번에 하나만 열리고 완료된 Todo도 메모를 수정할 수 있다", async ({
    page,
  }) => {
    const firstTitle = `E2E 첫 메모 ${Date.now()}`;
    const secondTitle = `E2E 둘째 메모 ${Date.now()}`;

    await page.goto("/");

    await page.getByRole("textbox", { name: "할 일" }).fill(firstTitle);
    await page.getByRole("button", { exact: true, name: "추가" }).click();
    await expect(page.getByText(firstTitle, { exact: true })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "할 일" })).toHaveValue("");

    await page.getByRole("textbox", { name: "할 일" }).fill(secondTitle);
    await page.getByRole("button", { exact: true, name: "추가" }).click();

    await expect(page.getByText(secondTitle, { exact: true })).toBeVisible();

    await page.getByRole("button", { name: `${firstTitle} 메모 추가` }).click();
    await expect(page.getByRole("textbox", { name: `${firstTitle} 메모` })).toBeVisible();

    await page.getByRole("button", { name: `${secondTitle} 메모 추가` }).click();

    await expect(page.getByRole("textbox", { name: `${firstTitle} 메모` })).not.toBeVisible();
    await expect(page.getByRole("textbox", { name: `${secondTitle} 메모` })).toBeVisible();

    await page.getByRole("button", { name: `${secondTitle} 메모 취소` }).click();
    await page.getByRole("checkbox", { name: `${secondTitle} 완료 처리` }).click();
    await expect(page.getByRole("checkbox", { name: `${secondTitle} 완료 취소` })).toBeChecked();

    await page.getByRole("button", { name: `${secondTitle} 메모 추가` }).click();
    await page.getByRole("textbox", { name: `${secondTitle} 메모` }).fill("완료 후에도 메모 수정");
    await page.getByRole("button", { name: `${secondTitle} 메모 저장` }).click();

    await expect(page.getByText("완료 후에도 메모 수정", { exact: true })).toBeVisible();
  });
});
