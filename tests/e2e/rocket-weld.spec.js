// E2E: the homepage rocket service bay's welding torch — press and hold on the
// bay and the cursor becomes an arc welder throwing sparks; on the hull it lays
// weld beads that cool off. Run: npm run test:e2e
//
// The scene draws on a <canvas>, so the tests read the live counters it writes
// on its element: data-welding, data-weld-sparks, data-weld-beads.
const { test, expect } = require("@playwright/test");

const SCENE = '[data-testid="rocket-works"]';
// Points inside the bay as fractions of its box: the rocket hull sits just
// right of center (see the geometry in RocketWorksScene), the top-right corner
// is empty bay.
const HULL = { fx: 0.56, fy: 0.47 };
const BAY = { fx: 0.9, fy: 0.12 };

let pageErrors;
test.beforeEach(({ page }) => {
    pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
});
test.afterEach(() => {
    expect(pageErrors, "no uncaught errors on the page").toEqual([]);
});

async function openBay(page) {
    await page.goto("/");
    const scene = page.locator(SCENE);
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute("data-interactive", "true");
    const box = await scene.boundingBox();
    const at = ({ fx, fy }) => ({ x: box.x + box.width * fx, y: box.y + box.height * fy });
    const count = async (name) => Number((await scene.getAttribute(name)) ?? "0");
    return { scene, box, at, count };
}

// hold the button down while tracing a short seam from p, like a hand at work
async function weldSeam(page, p, steps = 15) {
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    for (let i = 1; i <= steps; i++) {
        await page.mouse.move(p.x + Math.sin(i / 3) * 10, p.y + i * 2.5);
        await page.waitForTimeout(16);
    }
}

test("hovering the bay invites a press with a crosshair cursor", async ({ page }) => {
    const { scene, at } = await openBay(page);
    const p = at(HULL);
    await page.mouse.move(p.x, p.y);
    await expect(scene).toHaveCSS("cursor", "crosshair");
    await expect(scene).toHaveAttribute("data-welding", "false");
});

test("press and hold lights the torch and throws sparks; release puts it out", async ({ page }) => {
    const { scene, at, count } = await openBay(page);
    await weldSeam(page, at(HULL));
    await expect(scene).toHaveAttribute("data-welding", "true");
    await expect(scene, "the arc itself is the cursor while welding").toHaveCSS("cursor", "none");
    await expect.poll(() => count("data-weld-sparks")).toBeGreaterThan(20);

    await page.mouse.up();
    await expect(scene).toHaveAttribute("data-welding", "false");
    await expect(scene).toHaveCSS("cursor", "crosshair");
    // the last sparks rain down and burn out
    await expect.poll(() => count("data-weld-sparks"), { timeout: 5_000 }).toBe(0);
});

test("welding on the hull lays glowing weld beads that cool away", async ({ page }) => {
    const { at, count } = await openBay(page);
    await weldSeam(page, at(HULL));
    await expect.poll(() => count("data-weld-beads")).toBeGreaterThan(3);
    await page.mouse.up();
    await expect.poll(() => count("data-weld-beads"), { timeout: 5_000 }).toBe(0);
});

test("welding the empty bay throws sparks but leaves no weld beads", async ({ page }) => {
    const { at, count } = await openBay(page);
    await weldSeam(page, at(BAY));
    await expect.poll(() => count("data-weld-sparks")).toBeGreaterThan(20);
    expect(await count("data-weld-beads")).toBe(0);
    await page.mouse.up();
});

test("right-click does not light the torch", async ({ page }) => {
    const { scene, at, count } = await openBay(page);
    const p = at(HULL);
    await page.mouse.move(p.x, p.y);
    await page.mouse.down({ button: "right" });
    await page.mouse.move(p.x + 20, p.y + 20);
    await page.waitForTimeout(300);
    await expect(scene).toHaveAttribute("data-welding", "false");
    expect(await count("data-weld-sparks")).toBe(0);
    await page.mouse.up({ button: "right" });
});

test("dragging off the bay puts the torch out; coming back while holding re-lights it", async ({ page }) => {
    const { scene, box, at } = await openBay(page);
    const p = at(HULL);
    await weldSeam(page, p, 4);
    await expect(scene).toHaveAttribute("data-welding", "true");

    await page.mouse.move(p.x, box.y - 40); // above the bay
    await expect(scene).toHaveAttribute("data-welding", "false");

    await page.mouse.move(p.x, p.y); // back in, button still held
    await expect(scene).toHaveAttribute("data-welding", "true");
    await page.mouse.up();
    await expect(scene).toHaveAttribute("data-welding", "false");
});

test("touch: press and hold welds, lifting the finger stops", async ({ page }) => {
    const { scene, at, count } = await openBay(page);
    const p = at(HULL);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y }] });
    await expect(scene).toHaveAttribute("data-welding", "true");
    await expect.poll(() => count("data-weld-sparks")).toBeGreaterThan(10);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(scene).toHaveAttribute("data-welding", "false");
});

test.describe("with prefers-reduced-motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("the bay stays a still image: no torch, default cursor", async ({ page }) => {
        await page.goto("/");
        const scene = page.locator(SCENE);
        await scene.scrollIntoViewIfNeeded();
        await page.waitForLoadState("networkidle");
        const box = await scene.boundingBox();
        await page.mouse.move(box.x + box.width * HULL.fx, box.y + box.height * HULL.fy);
        await page.mouse.down();
        await page.waitForTimeout(400);
        await expect(scene).not.toHaveAttribute("data-interactive");
        await expect(scene).not.toHaveAttribute("data-welding");
        await expect(scene).toHaveCSS("cursor", "auto");
        await page.mouse.up();
    });
});
