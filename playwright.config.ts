import { defineConfig, devices } from "@playwright/test"

import { createGuestPasswordHash } from "./lib/guest-password"

const guestPasswordHash = createGuestPasswordHash(
  "test-guest-password",
  "00112233445566778899aabbccddeeff",
)

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      scale: "css",
    },
  },
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: {
    command: "pnpm dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      CANARY_GUEST_PASSWORD_HASH: guestPasswordHash,
      CANARY_GUEST_SESSION_SECRET: "test-canary-session-secret-that-is-long-enough",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
})
