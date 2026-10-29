// Unit tests for the welding-torch physics (src/lib/weld.mjs) behind the
// RocketWorksScene press-and-hold interaction. Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import {
    SPARK_CAP,
    SPARK_RATE,
    BEAD_LIFE,
    BEAD_EVERY,
    BEAD_CAP,
    mulberry32,
    spawnSparks,
    emitSparks,
    stepSparks,
    strikeEnvelope,
    sparkColor,
    beadGlow,
    shouldLayBead,
    pruneBeads,
    torchReducer,
} from "../../src/lib/weld.mjs";

const SCALE = 300; // a typical desktop rocket height in px
const opts = (seed = 1, extra = {}) => ({ scale: SCALE, floorY: 400, rand: mulberry32(seed), ...extra });

test("mulberry32 is deterministic per seed and stays in [0, 1)", () => {
    const a = mulberry32(42), b = mulberry32(42), c = mulberry32(7);
    const sa = Array.from({ length: 50 }, a);
    assert.deepEqual(sa, Array.from({ length: 50 }, b));
    assert.notDeepEqual(sa, Array.from({ length: 50 }, c));
    assert.ok(sa.every((v) => v >= 0 && v < 1));
});

test("spawnSparks adds exactly the requested count at the torch", () => {
    const sparks = [];
    assert.equal(spawnSparks(sparks, 12, 100, 200, opts()), 12);
    assert.equal(sparks.length, 12);
    for (const p of sparks) {
        assert.equal(p.x, 100);
        assert.equal(p.y, 200);
        assert.equal(p.life, 1);
        assert.equal(p.floorY, 400);
        assert.ok(p.maxLife >= 0.38 && p.maxLife <= 1.13);
        const speed = Math.hypot(p.vx, p.vy);
        assert.ok(speed >= SCALE * 0.25 - 1e-9 && speed <= SCALE * 1.2 + 1e-9);
    }
});

test("spawnSparks never exceeds the cap and ignores negative counts", () => {
    const sparks = [];
    assert.equal(spawnSparks(sparks, SPARK_CAP + 50, 0, 0, opts()), SPARK_CAP);
    assert.equal(spawnSparks(sparks, 10, 0, 0, opts()), 0);
    assert.equal(sparks.length, SPARK_CAP);
    assert.equal(spawnSparks([], -5, 0, 0, opts()), 0);
});

test("most sparks launch upward in a fan, the rest spit downward", () => {
    const sparks = [];
    spawnSparks(sparks, SPARK_CAP, 0, 0, opts(3));
    const up = sparks.filter((p) => p.vy < 0).length / sparks.length;
    assert.ok(up > 0.6 && up < 0.85, `upward share ${up}`);
});

test("emitSparks is frame-rate independent thanks to the fractional carry", () => {
    const emitFor = (fps) => {
        const sparks = [];
        let carry = 0, total = 0;
        for (let i = 0; i < fps; i++) {
            const r = emitSparks(sparks, 0, 0, 1 / fps, carry, opts(5, { cap: 1e9 }));
            carry = r.carry;
            total += r.emitted;
            assert.ok(r.carry >= 0 && r.carry < 1);
        }
        return total;
    };
    // one second of torch time emits ~SPARK_RATE sparks at any frame rate
    for (const fps of [30, 60, 144]) assert.ok(Math.abs(emitFor(fps) - SPARK_RATE) <= 1, `fps ${fps}`);
});

test("stepSparks applies gravity and integrates motion", () => {
    const sparks = [{ x: 0, y: 0, vx: 50, vy: -100, life: 1, maxLife: 1, floorY: 1000, width: 1 }];
    stepSparks(sparks, 0.1, { scale: SCALE });
    const [p] = sparks;
    const g = SCALE * 1.7;
    assert.ok(Math.abs(p.vy - (-100 + g * 0.1)) < 1e-9);
    assert.ok(Math.abs(p.x - 5) < 1e-9);
    assert.ok(Math.abs(p.y - p.vy * 0.1) < 1e-9);
    assert.ok(Math.abs(p.life - 0.9) < 1e-9);
});

test("sparks bounce off their floor losing energy, and never sink below it", () => {
    const sparks = [{ x: 0, y: 395, vx: 100, vy: 300, life: 1, maxLife: 100, floorY: 400, width: 1 }]; // long-lived so it outlasts the loop
    stepSparks(sparks, 1 / 60, { scale: SCALE });
    const [p] = sparks;
    assert.equal(p.y, 400);
    assert.ok(p.vy < 0, "rebounds upward");
    assert.ok(Math.abs(p.vy) < 300 * 0.5, "loses energy on impact");
    assert.ok(p.vx < 100, "friction slows the skid");
    for (let i = 0; i < 600; i++) {
        stepSparks(sparks, 1 / 60, { scale: SCALE });
        assert.ok(sparks[0].y <= 400 + 1e-9, "stays on or above the floor");
    }
});

test("a settled spark skids to a stop on the floor", () => {
    const sparks = [{ x: 0, y: 400, vx: 120, vy: 0, life: 1, maxLife: 10, floorY: 400, width: 1 }];
    for (let i = 0; i < 120; i++) stepSparks(sparks, 1 / 60, { scale: SCALE });
    assert.equal(sparks[0].vy, 0);
    assert.ok(Math.abs(sparks[0].vx) < 1, `vx ${sparks[0].vx}`);
});

test("every spark burns out within its lifetime and is removed", () => {
    const sparks = [];
    spawnSparks(sparks, 80, 200, 150, opts(9));
    let t = 0;
    while (sparks.length && t < 5) {
        stepSparks(sparks, 1 / 60, { scale: SCALE });
        t += 1 / 60;
    }
    assert.equal(sparks.length, 0);
    assert.ok(t <= 1.13 + 2 / 60, `all gone by ${t.toFixed(2)}s`);
});

test("strikeEnvelope flares on strike and settles to a steady 1", () => {
    assert.ok(Math.abs(strikeEnvelope(0) - 1.9) < 1e-9);
    assert.ok(strikeEnvelope(0.05) > strikeEnvelope(0.1));
    assert.ok(strikeEnvelope(0.1) > strikeEnvelope(0.3));
    assert.ok(Math.abs(strikeEnvelope(1) - 1) < 1e-5);
    assert.equal(strikeEnvelope(-1), 1); // before any strike
    assert.equal(strikeEnvelope(NaN), 1);
});

test("sparkColor cools from white-hot to amber-orange", () => {
    const [r1, g1, b1] = sparkColor(1);
    const [r0, g0, b0] = sparkColor(0);
    assert.deepEqual([r1, g1, b1], [255, 250, 230]);
    assert.deepEqual([r0, g0, b0], [255, 120, 40]);
    const mid = sparkColor(0.5);
    assert.ok(mid[1] < g1 && mid[1] > g0 && mid[2] < b1 && mid[2] > b0);
    assert.deepEqual(sparkColor(2), sparkColor(1)); // clamped
    assert.deepEqual(sparkColor(-1), sparkColor(0));
});

test("beadGlow fades out by BEAD_LIFE while shifting toward red", () => {
    const fresh = beadGlow(0), half = beadGlow(BEAD_LIFE / 2), cold = beadGlow(BEAD_LIFE);
    assert.equal(fresh.alpha, 1);
    assert.ok(half.alpha > 0 && half.alpha < 1);
    assert.equal(cold.alpha, 0);
    assert.equal(beadGlow(BEAD_LIFE * 3).alpha, 0);
    assert.ok(fresh.rgb[1] > half.rgb[1] && half.rgb[1] > cold.rgb[1], "green drains as it cools");
    assert.ok(fresh.rgb[2] > half.rgb[2] && half.rgb[2] >= cold.rgb[2], "blue drains as it cools");
});

test("weld beads are laid only on the hull while lit, throttled", () => {
    const base = { lit: true, overHull: true, t: 1, lastBeadT: 1 - BEAD_EVERY };
    assert.equal(shouldLayBead(base), true);
    assert.equal(shouldLayBead({ ...base, lit: false }), false);
    assert.equal(shouldLayBead({ ...base, overHull: false }), false);
    assert.equal(shouldLayBead({ ...base, lastBeadT: 1 - BEAD_EVERY / 2 }), false);
});

test("pruneBeads drops cooled beads and keeps only the newest BEAD_CAP", () => {
    const beads = [{ born: 0 }, { born: 0.5 }, { born: 1.5 }];
    assert.equal(pruneBeads(beads, BEAD_LIFE + 0.1), 2); // the t=0 bead has cooled
    assert.deepEqual(beads.map((b) => b.born), [0.5, 1.5]);
    const many = Array.from({ length: BEAD_CAP + 10 }, (_, i) => ({ born: 10 + i * 0.001 }));
    assert.equal(pruneBeads(many, 10.2), BEAD_CAP);
    assert.equal(many[0].born, 10 + 10 * 0.001); // oldest dropped first
});

test("torchReducer: a primary press lights the torch, release/leave/cancel put it out", () => {
    const down = (pointerType, button) => ({ type: "pointerdown", pointerType, button, buttons: button === 0 ? 1 : 2 });
    assert.equal(torchReducer(false, down("mouse", 0)), true);
    assert.equal(torchReducer(false, down("mouse", 2)), false, "right-click does not weld");
    assert.equal(torchReducer(false, down("touch", 0)), true);
    assert.equal(torchReducer(false, down("pen", 0)), true);
    for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
        assert.equal(torchReducer(true, { type }), false, type);
    }
});

test("torchReducer: moving keeps it lit only while the primary button is held", () => {
    assert.equal(torchReducer(true, { type: "pointermove", buttons: 1 }), true);
    assert.equal(torchReducer(true, { type: "pointermove", buttons: 0 }), false);
    assert.equal(torchReducer(false, { type: "pointermove", buttons: 1 }), true, "re-entering while holding re-lights");
    assert.equal(torchReducer(false, { type: "pointermove", buttons: 2 }), false, "right-drag does not weld");
    assert.equal(torchReducer(true, { type: "pointerover" }), true, "unrelated events keep state");
});
