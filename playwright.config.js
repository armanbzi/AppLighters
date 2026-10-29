// Playwright end-to-end tests. Runs in the locally installed Google Chrome
// (channel "chrome"), so no browser download is needed, and reuses a running
// dev server on :3000 or starts one. Run: npm run test:e2e
// Point at another deployment with E2E_BASE_URL=https://… npm run test:e2e
const { defineConfig, devices } = require("@playwright/test");

const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";

module.exports = defineConfig({
    testDir: "./tests/e2e",
    timeout: 60_000,
    expect: { timeout: 10_000 },
    workers: 1,
    reporter: [["list"]],
    use: {
        baseURL,
        trace: "retain-on-failure",
    },
    projects: [
        {
            name: "desktop-chrome",
            use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 1000 } },
        },
    ],
    webServer: process.env.E2E_BASE_URL
        ? undefined
        : { command: "npm run dev", url: baseURL, reuseExistingServer: true, timeout: 120_000 },
});
