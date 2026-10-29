// E2E: the motion budget (src/lib/motion.mjs). Animations only run while
// someone can see them: everything pauses while the window is unfocused or the
// tab hidden, sections scrolled out of view freeze, and every canvas scene
// still animates on the shared clock while visible. Run: npm run test:e2e
const { test, expect } = require("@playwright/test");

let pageErrors;
test.beforeEach(({ page }) => {
    pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
});
test.afterEach(() => {
    expect(pageErrors, "no uncaught errors on the page").toEqual([]);
});

// does a canvas repaint within `ms`? (sums a sample of its pixels twice)
const canvasMoves = (page, selector, ms = 600) =>
    page.evaluate(async ({ selector, ms }) => {
        const c = document.querySelector(selector);
        const g = c.getContext("2d");
        const sum = () => {
            const d = g.getImageData(0, 0, c.width, c.height).data;
            let s = 0;
            for (let i = 0; i < d.length; i += 97) s += d[i];
            return s;
        };
        const a = sum();
        await new Promise((r) => setTimeout(r, ms));
        return sum() !== a;
    }, { selector, ms });

// does the hero's app ticker drift within `ms`?
const tickerMoves = (page, ms = 500) =>
    page.evaluate(async (ms) => {
        const track = document.querySelector('a[aria-label][href]').parentElement;
        const a = track.style.transform;
        await new Promise((r) => setTimeout(r, ms));
        return track.style.transform !== a;
    }, ms);

const heroCssStates = (page) =>
    page.evaluate(() => [...new Set(document.querySelector(".hero-aura").getAnimations({ subtree: true }).map((a) => a.playState))]);

const setWindowFocus = (page, focused) =>
    page.evaluate((focused) => {
        if (focused) delete document.hasFocus;
        else document.hasFocus = () => false;
        window.dispatchEvent(new Event(focused ? "focus" : "blur"));
    }, focused);

test("losing window focus pauses every animation; regaining it resumes", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-motion", "running");
    await expect.poll(() => tickerMoves(page)).toBe(true);
    expect(await heroCssStates(page)).toContain("running");

    await setWindowFocus(page, false); // you switched to another app
    await expect(html).toHaveAttribute("data-motion", "paused");
    expect(await tickerMoves(page)).toBe(false);
    expect(await heroCssStates(page)).toEqual(["paused"]);

    await setWindowFocus(page, true);
    await expect(html).toHaveAttribute("data-motion", "running");
    await expect.poll(() => tickerMoves(page)).toBe(true);
    expect(await heroCssStates(page)).toContain("running");
});

test("sections scrolled out of view freeze, and resume when scrolled back", async ({ page }) => {
    await page.goto("/");
    const aura = page.locator(".hero-aura");
    await expect(aura).not.toHaveAttribute("data-paused");

    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await expect(aura).toHaveAttribute("data-paused", "");
    expect(await heroCssStates(page)).toEqual(["paused"]);

    await page.evaluate(() => scrollTo(0, 0));
    await expect(aura).not.toHaveAttribute("data-paused");
    await expect.poll(() => tickerMoves(page)).toBe(true);
});

test("the capability-card canvases animate on screen and stop off screen", async ({ page }) => {
    await page.goto("/");
    await page.locator("#capabilities .cap-card").first().scrollIntoViewIfNeeded();
    await expect.poll(() => canvasMoves(page, "#capabilities .cap-card canvas")).toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator("#capabilities .cap-bg > div").first()).toHaveAttribute("data-paused", "");
    expect(await canvasMoves(page, "#capabilities .cap-card canvas")).toBe(false);
});

test("the rocket bay animates while on screen", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="rocket-works"]').scrollIntoViewIfNeeded();
    await expect.poll(() => canvasMoves(page, '[data-testid="rocket-works"] canvas')).toBe(true);
});

test("app-ticker rings only spin while hovered; hover still shows the name pill", async ({ page }) => {
    await page.goto("/");
    // the tile closest to the middle of the screen (the edges fade out)
    const box = await page.evaluate(() => {
        const tiles = [...document.querySelectorAll("a[aria-label][href]")].filter((a) => a.querySelector(".tk-ring"));
        const mid = innerWidth / 2;
        const t = tiles.map((a) => a.getBoundingClientRect()).sort((a, b) => Math.abs(a.x + a.width / 2 - mid) - Math.abs(b.x + b.width / 2 - mid))[0];
        return { x: t.x + t.width / 2, y: t.y + t.height / 2 };
    });
    const ringStates = () => page.evaluate(() => [...document.querySelectorAll(".tk-ring > div")].map((d) => d.getAnimations()[0]?.playState));
    expect(new Set(await ringStates())).toEqual(new Set(["paused"]));

    await page.mouse.move(box.x, box.y);
    await expect.poll(async () => (await ringStates()).filter((s) => s === "running").length).toBe(1);
    const pill = await page.evaluate(({ x, y }) => {
        const a = document.elementFromPoint(x, y).closest("a");
        const cs = getComputedStyle(a.querySelector(".tk-name"));
        return { opacity: cs.opacity, backdrop: cs.backdropFilter };
    }, box);
    await expect.poll(async () => (await page.evaluate(({ x, y }) => getComputedStyle(document.elementFromPoint(x, y).closest("a").querySelector(".tk-name")).opacity, box))).toBe("1");
    expect(pill.backdrop).toContain("blur");
});

for (const slug of ["ai-integration", "data-storage", "cost-optimization", "automation", "cloud-scaling", "security-reliability", "ui-ux"]) {
    test(`the ${slug} hero animation runs on the shared clock`, async ({ page }) => {
        await page.goto(`/services/${slug}`);
        await expect.poll(() => canvasMoves(page, "canvas")).toBe(true);
    });
}

test.describe("with prefers-reduced-motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("canvas scenes render one still frame", async ({ page }) => {
        await page.goto("/services/ai-integration");
        await page.waitForLoadState("networkidle");
        expect(await canvasMoves(page, "canvas", 800)).toBe(false);
    });
});
