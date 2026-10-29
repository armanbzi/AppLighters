// Welding-torch physics for the RocketWorksScene interaction: press and hold on
// the service bay and the cursor becomes an arc welder throwing sparks, leaving
// glowing weld beads on the hull that cool off.
//
// Pure functions only (no DOM, no canvas) so the behaviour is unit-testable —
// the scene owns pointer handling and drawing. All speeds/gravity take a
// `scale` (the scene's rocket height in px) so the effect looks the same on
// every screen size.

export const SPARK_CAP = 160; // most sparks alive at once
export const SPARK_RATE = 240; // sparks per second while the arc is lit
export const STRIKE_BURST = 26; // sparks thrown the instant the arc strikes
export const BEAD_LIFE = 1.6; // seconds for a weld bead to cool to nothing
export const BEAD_EVERY = 0.035; // seconds between beads laid on the hull
export const BEAD_CAP = 70; // most beads kept at once

// Small seedable PRNG (mulberry32) so tests can be deterministic.
export function mulberry32(seed) {
    let a = seed >>> 0;
    return function rand() {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Push up to `count` new sparks at (x, y), never exceeding `cap` alive.
// Most fly up in a fan that arcs over and rains down; the rest spit downward.
// Returns how many were added.
export function spawnSparks(sparks, count, x, y, { scale, floorY, rand = Math.random, cap = SPARK_CAP }) {
    const n = Math.max(0, Math.min(Math.floor(count), cap - sparks.length));
    for (let i = 0; i < n; i++) {
        const up = rand() < 0.72;
        const a = up ? -Math.PI * (0.06 + rand() * 0.88) : Math.PI * (0.15 + rand() * 0.7);
        const speed = scale * (0.25 + rand() * 0.95);
        sparks.push({
            x,
            y,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed,
            life: 1, // 1 → 0 as it burns out
            maxLife: 0.38 + rand() * 0.75, // seconds
            floorY,
            width: 1 + rand() * 0.8,
        });
    }
    return n;
}

// Continuous emission while the arc is lit. `carry` holds the fractional spark
// owed from the previous frame, so the rate is the same at any frame rate.
export function emitSparks(sparks, x, y, dt, carry, opts) {
    const owed = carry + (opts.rate ?? SPARK_RATE) * dt;
    const whole = Math.floor(owed);
    const emitted = spawnSparks(sparks, whole, x, y, opts);
    return { emitted, carry: owed - whole };
}

// Advance every spark by dt: gravity, motion, a damped bounce off its floor
// and then a skid to a stop. Burnt-out sparks are removed in place.
// Returns how many are still alive.
export function stepSparks(sparks, dt, { scale, gravity = 1.7, bounce = 0.32, friction = 0.55 }) {
    const g = scale * gravity;
    for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life -= dt / p.maxLife;
        if (p.life <= 0) {
            sparks.splice(i, 1);
            continue;
        }
        p.vy += g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y >= p.floorY && p.vy >= 0) {
            p.y = p.floorY;
            if (p.vy > scale * 0.05) {
                p.vy = -p.vy * bounce; // bounce, losing energy
                p.vx *= friction;
            } else {
                p.vy = 0; // settled: skid along the floor
                p.vx *= Math.exp(-6 * dt);
            }
        }
    }
    return sparks.length;
}

// The arc flares when it strikes, then settles to a steady 1.
export function strikeEnvelope(sinceStrike) {
    if (!(sinceStrike >= 0)) return 1;
    return 1 + 0.9 * Math.exp(-sinceStrike * 14);
}

// Spark colour by remaining life: white-hot → amber → ember orange.
export function sparkColor(life) {
    const l = Math.max(0, Math.min(1, life));
    return [255, Math.round(120 + 130 * l), Math.round(40 + 190 * l * l)];
}

// A weld bead's glow as it cools: fades out over `life` seconds while its
// colour shifts from white-hot through orange to dull red.
export function beadGlow(age, life = BEAD_LIFE) {
    const k = Math.max(0, Math.min(1, age / life));
    return {
        alpha: Math.pow(1 - k, 1.6),
        rgb: [255, Math.round(245 - 185 * k), Math.round(225 - 205 * Math.min(1, k * 1.6))],
    };
}

// Beads are laid only on the hull while the arc is lit, at most every `every` s.
export function shouldLayBead({ lit, overHull, t, lastBeadT, every = BEAD_EVERY }) {
    return Boolean(lit && overHull && t - lastBeadT >= every);
}

// Drop fully-cooled beads and keep at most `cap` (oldest go first).
export function pruneBeads(beads, t, { life = BEAD_LIFE, cap = BEAD_CAP } = {}) {
    for (let i = beads.length - 1; i >= 0; i--) {
        if (t - beads[i].born >= life) beads.splice(i, 1);
    }
    if (beads.length > cap) beads.splice(0, beads.length - cap);
    return beads.length;
}

// Is the torch lit after this pointer event? A primary press lights it (mouse:
// left button only), moving keeps it lit only while the primary button is
// held (so dragging back in while holding re-lights it), and releasing,
// cancelling (e.g. the browser took over to scroll) or leaving puts it out.
export function torchReducer(lit, ev) {
    switch (ev.type) {
        case "pointerdown":
            return ev.pointerType !== "mouse" || ev.button === 0;
        case "pointermove":
            return (ev.buttons & 1) === 1;
        case "pointerup":
        case "pointercancel":
        case "pointerleave":
            return false;
        default:
            return lit;
    }
}
