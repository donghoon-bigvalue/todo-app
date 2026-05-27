import { expect, type Page, test } from "@playwright/test";

const verificationCode = "333333";

test.describe("Auth와 계정 관리 흐름", () => {
  test("회원가입 후 사용자별 Todo 데이터를 분리하고 refresh 후 요청을 계속 처리한다", async ({
    page,
  }) => {
    const suffix = Date.now();
    const firstLoginId = `e2e_first_${suffix}`;
    const secondLoginId = `e2e_second_${suffix}`;
    const firstTodo = `첫 번째 사용자 Todo ${suffix}`;

    await signup(page, {
      email: `${firstLoginId}@example.com`,
      loginId: firstLoginId,
    });
    await page.waitForTimeout(1_200);
    await page.getByRole("textbox", { name: "할 일" }).fill(firstTodo);
    await page.getByRole("button", { exact: true, name: "추가" }).click();

    await expect(page.getByText(firstTodo, { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "로그아웃" }).click();
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();

    await signup(page, {
      email: `${secondLoginId}@example.com`,
      loginId: secondLoginId,
    });

    await expect(page.getByText(firstTodo, { exact: true })).not.toBeVisible();
  });

  test("이메일 인증으로 로그인 ID를 찾고 비밀번호를 재설정한다", async ({ page }) => {
    const suffix = Date.now();
    const loginId = `e2e_recovery_${suffix}`;
    const email = `${loginId}@example.com`;

    await signup(page, { email, loginId });
    await page.getByRole("button", { name: "로그아웃" }).click();
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();

    await page.getByRole("button", { name: "아이디 찾기" }).click();
    await page.getByLabel("이메일").fill(email);
    await page.getByRole("button", { name: "인증 코드 발송" }).click();
    await page.getByLabel("인증 코드").fill(verificationCode);
    await page.getByRole("button", { name: "로그인 ID 확인" }).click();

    await expect(page.getByText(`로그인 ID: ${loginId}`)).toBeVisible();

    await page.getByRole("button", { name: "비밀번호 재설정" }).click();
    await page.getByLabel("이메일").fill(email);
    await page.getByRole("button", { name: "인증 코드 발송" }).click();
    await page.getByLabel("인증 코드").fill(verificationCode);
    await page.getByLabel("새 비밀번호", { exact: true }).fill("new-password1");
    await page.getByLabel("새 비밀번호 확인").fill("new-password1");
    await page.getByRole("button", { name: "비밀번호 변경" }).click();

    await expect(page.getByText("비밀번호가 변경되었습니다.")).toBeVisible();

    await page.getByRole("button", { name: "로그인" }).click();
    await login(page, { loginId, password: "new-password1" });

    await expect(page.getByRole("heading", { name: "할 일 체크리스트" })).toBeVisible();
  });

  test("로그인 후 비밀번호를 변경하고 회원탈퇴한다", async ({ page }) => {
    const suffix = Date.now();
    const loginId = `e2e_account_${suffix}`;
    const email = `${loginId}@example.com`;

    await signup(page, { email, loginId });
    await page.getByRole("button", { name: "계정 관리" }).click();
    await page.getByLabel("현재 비밀번호").fill("password1");
    await page.getByLabel("새 비밀번호", { exact: true }).fill("new-password1");
    await page.getByLabel("새 비밀번호 확인").fill("new-password1");
    await page.getByRole("button", { name: "비밀번호 변경" }).click();

    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();

    await login(page, { loginId, password: "new-password1" });
    await page.getByRole("button", { name: "계정 관리" }).click();
    await page.getByLabel("탈퇴 확인 비밀번호").fill("new-password1");
    await page.getByRole("button", { name: "회원탈퇴" }).click();

    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();

    await login(page, { loginId, password: "new-password1" });
    await expect(page.getByText("로그인하지 못했습니다.")).toBeVisible();

    await page.getByRole("button", { name: "회원가입" }).click();
    await page.getByLabel("로그인 ID").fill(loginId);
    await page.getByLabel("닉네임").fill("E2E 사용자");
    await page.getByLabel("이메일").fill(email);
    await page.getByLabel("비밀번호", { exact: true }).fill("password1");
    await page.getByLabel("비밀번호 확인").fill("password1");
    await page.getByRole("button", { name: "계정 만들기" }).click();

    await expect(page.getByRole("heading", { name: "할 일 체크리스트" })).toBeVisible();
  });
});

async function signup(
  page: Page,
  input: {
    readonly email: string;
    readonly loginId: string;
  },
) {
  await page.goto("/");
  await page.getByRole("button", { name: "회원가입" }).click();
  await page.getByLabel("로그인 ID").fill(input.loginId);
  await page.getByLabel("닉네임").fill("E2E 사용자");
  await page.getByLabel("이메일").fill(input.email);
  await page.getByLabel("비밀번호", { exact: true }).fill("password1");
  await page.getByLabel("비밀번호 확인").fill("password1");
  await page.getByRole("button", { name: "계정 만들기" }).click();

  await expect(page.getByRole("heading", { name: "할 일 체크리스트" })).toBeVisible();
}

async function login(
  page: Page,
  input: {
    readonly loginId: string;
    readonly password: string;
  },
) {
  await page.getByLabel("로그인 ID").fill(input.loginId);
  await page.getByLabel("비밀번호").fill(input.password);
  await page.getByRole("button", { exact: true, name: "로그인" }).last().click();
}
