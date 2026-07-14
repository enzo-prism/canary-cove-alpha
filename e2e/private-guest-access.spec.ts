import { expect, test } from "@playwright/test"

test.describe("private guest area", () => {
  test("redirects unauthenticated visitors without exposing guest content", async ({ page, request, baseURL }) => {
    const anonymous = await request.get(`${baseURL}/guest`, { maxRedirects: 0 })
    expect(anonymous.status()).toBe(307)
    expect(anonymous.headers()["cache-control"]).toContain("no-store")
    expect(anonymous.headers()["x-robots-tag"]).toContain("noindex")
    expect(await anonymous.text()).not.toContain("Canary Cove guest guide")

    const nested = await request.get(`${baseURL}/guest/private-file`, { maxRedirects: 0 })
    expect(nested.status()).toBe(307)

    await page.goto("/guest")

    await expect(page).toHaveURL(/\/guest\/access\?next=%2Fguest$/)
    await expect(page.getByRole("heading", { name: "Guest access", level: 1 })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Canary Cove guest guide", level: 1 })).toHaveCount(0)
  })

  test("rejects a wrong password and grants a scoped session for the correct password", async ({ page, context }) => {
    await page.goto("/guest/access?next=%2Fguest")
    await page.getByLabel("Access password").fill("wrong-password")
    await page.getByRole("button", { name: "Open guest guide" }).click()
    await expect(page.getByRole("alert").filter({ hasText: "could not verify" })).toContainText("could not verify")

    await page.getByLabel("Access password").fill("test-guest-password")
    await page.getByRole("button", { name: "Open guest guide" }).click()

    await expect(page).toHaveURL(/\/guest$/)
    await expect(page.getByRole("heading", { name: "Canary Cove guest guide", level: 1 })).toBeVisible()
    await expect(page.getByText("Don's guest details will appear here after the final sketch is approved.")).toBeVisible()
    await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0)
    await expect(page.getByTestId("elevenlabs-convai-widget")).toHaveCount(0)

    const accessCookie = (await context.cookies()).find((cookie) => cookie.name === "__Host-canary_guest_session")
    expect(accessCookie?.httpOnly).toBe(true)
    expect(accessCookie?.secure).toBe(true)
    expect(accessCookie?.sameSite).toBe("Strict")
    expect(accessCookie?.path).toBe("/")

    await page.getByRole("button", { name: "Sign out" }).click()
    await expect(page).toHaveURL(/\/guest\/access/)
  })

  test("rejects a tampered session cookie", async ({ page, context }) => {
    await page.goto("/guest/access?next=%2Fguest")
    await page.getByLabel("Access password").fill("test-guest-password")
    await page.getByRole("button", { name: "Open guest guide" }).click()
    await expect(page).toHaveURL(/\/guest$/)

    const current = (await context.cookies()).find((cookie) => cookie.name === "__Host-canary_guest_session")
    expect(current).toBeTruthy()
    await context.addCookies([{ ...current!, value: `x${current!.value.slice(1)}` }])
    await page.goto("/guest")
    await expect(page).toHaveURL(/\/guest\/access/)
    await expect(page.getByRole("heading", { name: "Canary Cove guest guide", level: 1 })).toHaveCount(0)
  })

  test("keeps the private guest area out of public discovery files", async ({ request, baseURL }) => {
    const robots = await (await request.get(`${baseURL}/robots.txt`)).text()
    expect(robots).toContain("Disallow: /guest")

    const sitemap = await (await request.get(`${baseURL}/sitemap.xml`)).text()
    expect(sitemap).not.toContain("/guest")

    const llms = await (await request.get(`${baseURL}/llms.txt`)).text()
    expect(llms).not.toContain("/guest")
    const llmsFull = await (await request.get(`${baseURL}/llms-full.txt`)).text()
    expect(llmsFull).not.toContain("/guest")
  })
})
