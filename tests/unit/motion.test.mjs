// Unit tests for the motion budget (src/lib/motion.mjs): when animation is
// allowed, and the shared clock that drives every canvas loop. Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { motionAllowed, shouldFire, createTicker } from "../../src/lib/motion.mjs";

// A fake requestAnimationFrame: frames are pumped by hand at a given refresh rate.
function fakeDisplay(hz) {
    let next = 1, now = 0;
    const pending = new Map();
    return {
        raf: (cb) => { pending.set(next, cb); return next++; },
        caf: (h) => pending.delete(h),
        // advance one vsync and run whatever was scheduled for it
        frame() {
            now += 1000 / hz;
            const cbs = [...pending.values()];
            pending.clear();
            cbs.forEach((cb) => cb(now));
        },
        frames(n) { for (let i = 0; i < n; i++) this.frame(); },
        get scheduled() { return pending.size; },
    };
}

test("motion is allowed only while the tab is visible and the window focused", () => {
    assert.equal(motionAllowed({ hidden: false, focused: true }), true);
    assert.equal(motionAllowed({ hidden: true, focused: true }), false, "hidden tab");
    assert.equal(motionAllowed({ hidden: false, focused: false }), false, "another app has focus");
    assert.equal(motionAllowed({ hidden: true, focused: false }), false);
});

test("shouldFire: first frame always fires, then once per interval with jitter tolerance", () => {
    assert.equal(shouldFire(1000, null, 60), true);
    assert.equal(shouldFire(1016.7, 1000, 60), true, "next 60 Hz frame");
    assert.equal(shouldFire(1015.5, 1000, 60), true, "a slightly early vsync still counts");
    assert.equal(shouldFire(1008.3, 1000, 60), false, "a 120 Hz frame in between is skipped");
    assert.equal(shouldFire(1016.7, 1000, 30), false, "30 fps skips every other 60 Hz frame");
    assert.equal(shouldFire(1033.3, 1000, 30), true);
});

test("one rAF loop serves every subscriber", () => {
    const d = fakeDisplay(60);
    const t = createTicker(d.raf, d.caf);
    t.add(() => {}, 60);
    t.add(() => {}, 60);
    t.add(() => {}, 30);
    assert.equal(d.scheduled, 1, "a single pending frame, not one per loop");
    assert.equal(t.size(), 3);
});

test("a 60 fps loop draws every frame at 60 Hz but every other frame at 120 Hz", () => {
    for (const [hz, expected] of [[60, 60], [120, 60]]) {
        const d = fakeDisplay(hz);
        const t = createTicker(d.raf, d.caf);
        let n = 0;
        t.add(() => n++, 60);
        d.frames(hz); // one second
        assert.ok(Math.abs(n - expected) <= 1, `${hz} Hz: ${n} draws`);
    }
});

test("a 30 fps loop draws every other frame at 60 Hz", () => {
    const d = fakeDisplay(60);
    const t = createTicker(d.raf, d.caf);
    let n = 0;
    t.add(() => n++, 30);
    d.frames(60);
    assert.ok(Math.abs(n - 30) <= 1, `${n} draws`);
});

test("loops sharing a frame rate draw on the very same frames", () => {
    const d = fakeDisplay(60);
    const t = createTicker(d.raf, d.caf);
    const a = [], b = [];
    t.add((now) => a.push(now), 30);
    d.frames(3); // b joins out of phase
    t.add((now) => b.push(now), 30);
    d.frames(30);
    const tail = (xs) => xs.slice(-5);
    assert.deepEqual(tail(b), tail(a), "both 30 fps loops land on identical vsyncs");
});

test("unsubscribing the last loop stops the clock; a new loop restarts it", () => {
    const d = fakeDisplay(60);
    const t = createTicker(d.raf, d.caf);
    let n = 0;
    const off = t.add(() => n++, 60);
    d.frames(5);
    off();
    assert.equal(d.scheduled, 0, "no frame requested while nothing animates");
    d.frames(5);
    assert.equal(n, 5, "stopped loop no longer runs");
    t.add(() => n++, 60);
    assert.equal(d.scheduled, 1);
    d.frames(2);
    assert.equal(n, 7);
});

test("a loop may unsubscribe itself mid-tick without disturbing the others", () => {
    const d = fakeDisplay(60);
    const t = createTicker(d.raf, d.caf);
    let other = 0, selfRuns = 0;
    let off = null;
    off = t.add(() => { selfRuns++; off(); }, 60);
    t.add(() => other++, 60);
    d.frames(4);
    assert.equal(selfRuns, 1);
    assert.equal(other, 4);
});
