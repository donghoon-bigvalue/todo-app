import { defineConfig, devices } from "@playwright/test";

const WEB_BASE_URL = "http://127.0.0.1:5173";
const API_BASE_URL = "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: WEB_BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command:
        "SMTP_TRANSPORT=stream AUTH_EMAIL_VERIFICATION_DIGIT=3 AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS=1 npm run api:start",
      url: `${API_BASE_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "npm run web:e2e",
      url: WEB_BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
