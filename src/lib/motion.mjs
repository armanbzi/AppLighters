// Motion budget for the site's ambient animations.
//
// Every animation here is decorative, so it only needs to run while someone
// can see it. Browsers already stop requestAnimationFrame in hidden tabs, but
// a visible-yet-unfocused window (you're working in another app) keeps every
// CSS animation and canvas loop rendering at the display's full refresh rate,
// and off-screen CSS animations never stop on their own. This module:
//
//   • tracks whether motion is allowed (tab visible AND window focused) and
//     mirrors it on <html data-motion="running|paused">; a global rule in
//     styles/_bgAnim.scss freezes every CSS animation while paused;
//   • drives all canvas loops from ONE shared clock, capped per loop (frame
//     rates are shared buckets, so loops asking for the same rate draw on the
//     very same frames instead of interleaving — and a 120 Hz display doesn't
//     double the work);
//   • watchLoop(): runs a loop only while its element is on screen and motion
//     is allowed, and flags the element data-paused otherwise so the CSS
//     animations inside it freeze too.
//
// The pure parts (motionAllowed, shouldFire, createTicker) are unit-tested.

/* ── pure helpers ─────────────────────────────────────────────────────── */

// Animate only while someone can see it.
export function motionAllowed({ hidden, focused }) {
    return !hidden && Boolean(focused);
}

// Should a clock bucket running at `fps` fire on a frame at `now` (ms) when it
// last fired at `last`? The 15% tolerance absorbs vsync jitter, so a 60 fps
// bucket fires on every frame of a 60 Hz display and every other frame at
// 120 Hz, and a 30 fps bucket fires on every other frame at 60 Hz.
export function shouldFire(now, last, fps) {
    if (last == null) return true;
    return now - last >= (1000 / fps) * 0.85;
}

// One requestAnimationFrame loop for every subscriber. `raf`/`caf` are
// injectable so the clock can be tested without a browser.
export function createTicker(raf, caf) {
    const buckets = new Map(); // fps -> { last, subs }
    let id = 0;
    const size = () => {
        let n = 0;
        for (const b of buckets.values()) n += b.subs.size;
        return n;
    };
    const tick = (now) => {
        id = 0;
        for (const [fps, b] of buckets) {
            if (!b.subs.size || !shouldFire(now, b.last, fps)) continue;
            b.last = now;
            for (const fn of [...b.subs]) fn(now);
        }
        if (size()) id = raf(tick);
    };
    return {
        add(fn, fps = 60) {
            let b = buckets.get(fps);
            if (!b) buckets.set(fps, (b = { last: null, subs: new Set() }));
            b.subs.add(fn);
            if (!id) id = raf(tick);
            return () => {
                b.subs.delete(fn);
                if (!size() && id) {
                    caf(id);
                    id = 0;
                }
            };
        },
        size,
    };
}

/* ── browser wiring ───────────────────────────────────────────────────── */

const listeners = new Set();
let allowed = true;
let inited = false;
let ticker = null;

const readAllowed = () => motionAllowed({ hidden: document.hidden, focused: document.hasFocus() });
const publish = () => {
    document.documentElement.dataset.motion = allowed ? "running" : "paused";
};
const update = () => {
    const next = readAllowed();
    if (next === allowed) return;
    allowed = next;
    publish();
    listeners.forEach((fn) => fn(allowed));
};

// Start tracking focus/visibility. Called from pages/_app.js (so CSS-only
// animations are covered on every page) and lazily by watchLoop.
export function initMotion() {
    if (inited || typeof window === "undefined") return;
    inited = true;
    allowed = readAllowed();
    publish();
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    window.addEventListener("blur", update);
}

export const isMotionAllowed = () => allowed;

export function onMotionChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

const sharedTicker = () =>
    ticker || (ticker = createTicker((f) => requestAnimationFrame(f), (h) => cancelAnimationFrame(h)));

// Run frame(now) on the shared clock at `fps` while `el` is on screen and
// motion is allowed; otherwise unsubscribe and flag `el` data-paused (freezing
// its CSS animations). Pass frame = null to only manage the CSS pause.
// `onStart` runs each time the loop (re)starts — reset dt bookkeeping there.
// Returns { stop(), setFps(fps) }.
export function watchLoop(el, frame, { fps = 60, onStart } = {}) {
    initMotion();
    let visible = typeof IntersectionObserver === "undefined";
    let unsub = null;
    let rate = fps;
    const sync = () => {
        const want = visible && allowed;
        if (frame && want && !unsub) {
            if (onStart) onStart();
            unsub = sharedTicker().add(frame, rate);
        } else if (frame && !want && unsub) {
            unsub();
            unsub = null;
        }
        if (want) el.removeAttribute("data-paused");
        else el.setAttribute("data-paused", "");
    };
    let io = null;
    if (!visible) {
        io = new IntersectionObserver((entries) => {
            visible = entries[entries.length - 1].isIntersecting;
            sync();
        });
        io.observe(el);
    }
    const off = onMotionChange(sync);
    sync();
    return {
        stop() {
            if (io) io.disconnect();
            off();
            if (unsub) unsub();
            unsub = null;
        },
        setFps(next) {
            if (next === rate) return;
            rate = next;
            if (unsub) {
                unsub();
                unsub = sharedTicker().add(frame, rate);
            }
        },
    };
}
