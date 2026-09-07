import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Animated background for a capability card. Each service gets its own
// miniature scene — a distilled echo of that service's hero animation, so a
// card previews the page it links to. Drifts slowly at rest and accelerates
// smoothly while the card is hovered/focused.
//
// One small <canvas> per card (no library). Time is accumulated as
// `t += dt * speed`, and `speed` eases toward the hover target, so speeding up
// and slowing down never jumps the animation. Pauses while off-screen and
// renders a single static frame under prefers-reduced-motion.

const IDLE_SPEED = 1;
const HOVER_SPEED = 3.2;

const hexToRgb = (hex) => {
    const h = (hex || "#C15BEE").replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

/* ── the six mini-scenes ─────────────────────────────────────────────────── */

// AI Integration — a small neural net with a wavefront sweeping left to right.
function neural(ctx, w, h, t, C, rgba) {
    const cols = [
        { x: w * 0.2, n: 3 },
        { x: w * 0.5, n: 4 },
        { x: w * 0.8, n: 3 },
    ];
    const pts = cols.map(({ x, n }) =>
        Array.from({ length: n }, (_, i) => ({ x, y: h * (0.5 + (i - (n - 1) / 2) * 0.19) }))
    );
    for (let l = 0; l < pts.length - 1; l++) {
        for (const a of pts[l]) for (const b of pts[l + 1]) {
            ctx.strokeStyle = rgba(C.a, 0.22);
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
    }
    const sweep = ((t * 0.28) % 1.5 - 0.25) * w;
    const sigma = w * 0.14;
    for (const col of pts) for (const p of col) {
        const g = Math.exp(-((p.x - sweep) ** 2) / (2 * sigma * sigma));
        ctx.fillStyle = rgba(C.a, 0.3 + 0.65 * g);
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.4 + 1.8 * g, 0, Math.PI * 2); ctx.fill();
    }
}

// Data & Storage — a rotating mandala of rings, ticks and an orbiting block.
function mandala(ctx, w, h, t, C, rgba) {
    const cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.42;
    ctx.save(); ctx.translate(cx, cy);
    [0.42, 0.66, 0.9].forEach((f, i) => {
        ctx.strokeStyle = rgba(i % 2 ? C.b : C.a, 0.34);
        ctx.lineWidth = 1;
        ctx.setLineDash(i === 1 ? [6, 7] : []);
        ctx.beginPath(); ctx.arc(0, 0, R * f, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.setLineDash([]);
    const ticks = 24, rot = t * 0.22;
    ctx.strokeStyle = rgba(C.a, 0.4);
    ctx.beginPath();
    for (let i = 0; i < ticks; i++) {
        const a = rot + (i / ticks) * Math.PI * 2;
        ctx.moveTo(R * 0.72 * Math.cos(a), R * 0.72 * Math.sin(a));
        ctx.lineTo(R * 0.82 * Math.cos(a), R * 0.82 * Math.sin(a));
    }
    ctx.stroke();
    const hex = -t * 0.16;
    ctx.strokeStyle = rgba(C.b, 0.38); ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
        const a = hex + (i / 6) * Math.PI * 2;
        const x = R * 0.34 * Math.cos(a), y = R * 0.34 * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    const oa = t * 0.5;
    ctx.fillStyle = rgba(C.a, 0.85);
    ctx.fillRect(R * 0.56 * Math.cos(oa) - 2.5, R * 0.56 * Math.sin(oa) - 2.5, 5, 5);
    ctx.restore();
}

// Cost Optimization — a bar row squashed by a travelling savings wave.
function bars(ctx, w, h, t, C, rgba) {
    const n = 13, base = h * 0.86, slot = w / (n + 1);
    const sweep = ((t * 0.22) % 1.5 - 0.25) * w;
    const sigma = w * 0.13;
    for (let i = 0; i < n; i++) {
        const x = slot * (i + 1);
        const g = Math.exp(-((x - sweep) ** 2) / (2 * sigma * sigma));
        const bh = h * (0.16 + 0.16 * (0.5 + 0.5 * Math.sin(t * 0.5 + i))) * (1 - 0.45 * g);
        const grad = ctx.createLinearGradient(0, base - bh, 0, base);
        grad.addColorStop(0, rgba(C.b, 0.36 + 0.34 * g));
        grad.addColorStop(1, rgba(C.a, 0.1));
        ctx.fillStyle = grad;
        ctx.fillRect(x - slot * 0.22, base - bh, slot * 0.44, bh);
        ctx.fillStyle = rgba(C.b, 0.28 + 0.5 * g);
        ctx.fillRect(x - slot * 0.22, base - bh, slot * 0.44, 1.5);
    }
    ctx.strokeStyle = rgba(C.a, 0.22); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(w, base); ctx.stroke();
}

// Automation & DevOps — the infinity loop with particles running it.
function infinity(ctx, w, h, t, C, rgba) {
    const cx = w * 0.5, cy = h * 0.5, a = Math.min(w * 0.42, h * 0.92);
    const P = (u) => {
        const s = Math.sin(u), c = Math.cos(u), d = 1 + s * s;
        return { x: cx + (a * c) / d, y: cy + (a * s * c) / d };
    };
    ctx.strokeStyle = rgba(C.a, 0.34); ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i <= 140; i++) {
        const p = P((i / 140) * Math.PI * 2);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath(); ctx.stroke();
    for (let k = 0; k < 2; k++) {
        const u = t * 0.5 + k * Math.PI;
        for (let j = 6; j >= 0; j--) {
            const p = P(u - j * 0.05);
            ctx.fillStyle = rgba(j === 0 ? C.b : C.a, 0.75 * (1 - j / 7));
            ctx.beginPath(); ctx.arc(p.x, p.y, j === 0 ? 3 : 2, 0, Math.PI * 2); ctx.fill();
        }
    }
}

// Cloud & Scalability — drifting clouds over a cluster that scales with demand.
function clouds(ctx, w, h, t, C, rgba) {
    const puff = (x, y, s, alpha) => {
        ctx.strokeStyle = rgba(C.a, alpha); ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(x - 0.26 * s, y, 0.24 * s, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(x + 0.02 * s, y - 0.15 * s, 0.3 * s, Math.PI * 1.05, Math.PI * 1.95);
        ctx.arc(x + 0.28 * s, y, 0.22 * s, Math.PI * 1.5, Math.PI * 0.5);
        ctx.closePath(); ctx.stroke();
    };
    const drift = (sp, off) => ((t * sp + off) % (w + 140)) - 70;
    puff(drift(9, 0), h * 0.3, Math.min(w * 0.3, 78), 0.3);
    puff(drift(6, w * 0.55), h * 0.52, Math.min(w * 0.22, 58), 0.2);
    const demand = 0.5 + 0.5 * Math.sin(t * 0.35);
    const total = 8, on = 2 + Math.round(demand * (total - 2));
    const cw = 13, gap = 5, startX = w * 0.5 - ((cw + gap) * 4 - gap) / 2;
    for (let i = 0; i < total; i++) {
        const col = i % 4, row = Math.floor(i / 4);
        const x = startX + col * (cw + gap), y = h * 0.7 + row * (cw + gap);
        const lit = i < on;
        ctx.fillStyle = rgba(C.b, lit ? 0.55 : 0.1);
        ctx.strokeStyle = rgba(C.b, lit ? 0.8 : 0.18);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, cw, cw, 3) : ctx.rect(x, y, cw, cw);
        ctx.fill(); ctx.stroke();
    }
}

// Security & Reliability — a radar sweep clearing blips, with a shield pulse.
function radar(ctx, w, h, t, C, rgba) {
    const cx = w * 0.5, cy = h * 0.54, R = Math.min(w * 0.46, h * 0.46);
    ctx.save(); ctx.translate(cx, cy);
    for (let i = 1; i <= 3; i++) {
        ctx.strokeStyle = rgba(C.a, 0.2);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(0, 0, (R * i) / 3, 0, Math.PI * 2); ctx.stroke();
    }
    const th = t * 0.7;
    ctx.save(); ctx.rotate(th);
    const grad = ctx.createLinearGradient(0, 0, R, 0);
    grad.addColorStop(0, rgba(C.b, 0));
    grad.addColorStop(1, rgba(C.b, 0.5));
    ctx.strokeStyle = grad; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, 0); ctx.stroke();
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = rgba(C.b, 0.06 * (5 - i));
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.arc(0, 0, R, -0.1 * (i + 1), -0.1 * i); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    const blips = [[0.55, -0.9], [0.8, -2.1], [0.42, 0.6]];
    for (const [rf, ang] of blips) {
        const diff = Math.abs(((th - ang) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
        const fresh = Math.max(0, 1 - diff / 1.3);
        ctx.fillStyle = rgba(fresh > 0.55 ? C.b : C.a, 0.25 + 0.7 * fresh);
        ctx.beginPath();
        ctx.arc(R * rf * Math.cos(ang), R * rf * Math.sin(ang), 2.6, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

// ── "How it works" steps ────────────────────────────────────────────────────

// Audit — a scan beam sweeping a grid of blocks, flagging a few as it passes.
function audit(ctx, w, h, t, C, rgba) {
    const cols = 9, rows = 3;
    const gw = w / (cols + 1), gh = h * 0.16;
    const y0 = h * 0.42;
    const beam = ((t * 0.26) % 1.5 - 0.25) * w;
    const sigma = w * 0.1;
    const flagged = new Set([4, 11, 19]);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = gw * (c + 1), y = y0 + r * gh;
            const g = Math.exp(-((x - beam) ** 2) / (2 * sigma * sigma));
            const i = r * cols + c;
            const hit = flagged.has(i);
            const size = 7;
            ctx.strokeStyle = rgba(hit && g > 0.25 ? C.b : C.a, 0.26 + 0.65 * g);
            ctx.lineWidth = 1;
            ctx.strokeRect(x - size / 2, y - size / 2, size, size);
            if (hit) { // a finding: keeps glowing after the beam has gone
                ctx.fillStyle = rgba(C.b, 0.3 + 0.45 * (0.5 + 0.5 * Math.sin(t * 3 + i)));
                ctx.fillRect(x - size / 2, y - size / 2, size, size);
            }
        }
    }
    // the beam itself
    const bg = ctx.createLinearGradient(beam - 26, 0, beam + 4, 0);
    bg.addColorStop(0, rgba(C.a, 0));
    bg.addColorStop(1, rgba(C.a, 0.5));
    ctx.strokeStyle = bg; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(beam, y0 - gh * 0.8); ctx.lineTo(beam, y0 + rows * gh - gh * 0.3); ctx.stroke();
}

// Plan — a route drawing itself through waypoints, one leg at a time.
function plan(ctx, w, h, t, C, rgba) {
    const pts = [
        { x: w * 0.1, y: h * 0.78 },
        { x: w * 0.32, y: h * 0.52 },
        { x: w * 0.54, y: h * 0.66 },
        { x: w * 0.76, y: h * 0.36 },
        { x: w * 0.93, y: h * 0.5 },
    ];
    // dashed "not yet planned" route
    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = rgba(C.a, 0.22); ctx.lineWidth = 1.2;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
    ctx.setLineDash([]);
    // solid progress up to u
    const u = (t * 0.16) % 1.25;
    const legs = pts.length - 1;
    const done = Math.min(legs, u * legs);
    ctx.strokeStyle = rgba(C.b, 0.75); ctx.lineWidth = 2; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < legs; i++) {
        const f = Math.max(0, Math.min(1, done - i));
        if (f <= 0) break;
        ctx.lineTo(pts[i].x + (pts[i + 1].x - pts[i].x) * f, pts[i].y + (pts[i + 1].y - pts[i].y) * f);
    }
    ctx.stroke();
    pts.forEach((p, i) => {
        const lit = done >= i - 0.02;
        ctx.fillStyle = rgba(lit ? C.b : C.a, lit ? 0.9 : 0.25);
        ctx.beginPath(); ctx.arc(p.x, p.y, lit ? 3.4 : 2.6, 0, Math.PI * 2); ctx.fill();
        if (lit) {
            ctx.strokeStyle = rgba(C.b, 0.35); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.stroke();
        }
    });
}

// Boost — a radiating burst MANDALA: concentric rings of petals that light up
// in an outward wave from a pulsing core, so energy visibly travels outward.
// Deliberately different in character from the data-storage mandala (which is a
// rotating disk of sectors/ticks) — this one radiates rather than spins.
function boost(ctx, w, h, t, C, rgba) {
    const cx = w * 0.5, cy = h * 0.52;
    const R = Math.min(w * 0.42, h * 0.62);
    const RINGS = [
        { n: 6, r: 0.34, len: 0.1, rot: 0.18, wid: 2.4 },
        { n: 12, r: 0.56, len: 0.11, rot: -0.12, wid: 1.8 },
        { n: 18, r: 0.78, len: 0.1, rot: 0.08, wid: 1.4 },
        { n: 24, r: 0.96, len: 0.07, rot: -0.05, wid: 1.1 },
    ];

    ctx.save();
    ctx.translate(cx, cy);

    RINGS.forEach((ring, ri) => {
        // the outward pulse: each ring peaks a beat after the one inside it
        const wave = 0.5 + 0.5 * Math.sin(t * 1.9 - ri * 0.85);
        const a = 0.14 + 0.5 * wave;
        const rot = t * ring.rot;
        const r0 = R * ring.r, r1 = R * (ring.r + ring.len * (0.7 + 0.6 * wave));

        ctx.strokeStyle = rgba(ri % 2 ? C.b : C.a, a);
        ctx.lineWidth = ring.wid;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let i = 0; i < ring.n; i++) {
            const ang = rot + (i / ring.n) * Math.PI * 2;
            ctx.moveTo(r0 * Math.cos(ang), r0 * Math.sin(ang));
            ctx.lineTo(r1 * Math.cos(ang), r1 * Math.sin(ang));
        }
        ctx.stroke();

        // faint tie ring holding each petal layer together
        ctx.strokeStyle = rgba(C.a, 0.1 + 0.16 * wave);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, r0, 0, Math.PI * 2);
        ctx.stroke();
    });

    // expanding shockwave ring
    const q = (t * 0.42) % 1;
    ctx.strokeStyle = rgba(C.b, 0.32 * (1 - q));
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, R * (0.25 + q * 0.85), 0, Math.PI * 2);
    ctx.stroke();

    // pulsing core
    const beat = 0.5 + 0.5 * Math.sin(t * 1.9);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * (0.2 + beat * 0.08));
    core.addColorStop(0, rgba(C.b, 0.55 + 0.3 * beat));
    core.addColorStop(0.45, rgba(C.a, 0.22));
    core.addColorStop(1, rgba(C.a, 0));
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, R * (0.2 + beat * 0.08), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
}

const SCENES = {
    "ai-integration": neural,
    "data-storage": mandala,
    "cost-optimization": bars,
    "automation": infinity,
    "cloud-scaling": clouds,
    "security-reliability": radar,
    audit,
    plan,
    boost,
};

export default function CardBg({ variant, accent, hovered }) {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const hoverRef = useRef(false);

    useEffect(() => { hoverRef.current = !!hovered; }, [hovered]);

    useEffect(() => {
        const wrap = wrapRef.current, canvas = canvasRef.current;
        if (!wrap || !canvas || typeof window === "undefined") return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scene = SCENES[variant] || neural;
        const C = { a: hexToRgb(accent?.a), b: hexToRgb(accent?.b || accent?.a) };
        const rgba = (c, alpha) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        let w = 0, h = 0, raf = 0, running = true, last = 0, t = 8, speed = IDLE_SPEED;

        const resize = () => {
            const r = wrap.getBoundingClientRect();
            w = Math.max(1, r.width); h = Math.max(1, r.height);
            canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
            canvas.style.width = w + "px"; canvas.style.height = h + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const frame = (now) => {
            const nowS = now / 1000;
            const dt = Math.min(0.05, Math.max(0.001, nowS - (last || nowS)));
            last = nowS;
            // ease toward the hover speed so it never jumps
            const target = hoverRef.current ? HOVER_SPEED : IDLE_SPEED;
            speed += (target - speed) * Math.min(1, dt * 4);
            t += dt * speed;
            ctx.clearRect(0, 0, w, h);
            scene(ctx, w, h, t, C, rgba);
            if (running && !reduce) raf = requestAnimationFrame(frame);
        };

        const start = () => { if (raf) cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };

        resize();
        if (reduce) frame(performance.now());
        else start();

        let io;
        if (!reduce && typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver((es) => es.forEach((e) => {
                running = e.isIntersecting;
                if (running) start(); else if (raf) cancelAnimationFrame(raf);
            }));
            io.observe(wrap);
        }
        let ro;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => { resize(); if (reduce) frame(performance.now()); });
            ro.observe(wrap);
        }
        return () => { if (io) io.disconnect(); if (ro) ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
    }, [variant, accent]);

    return (
        <Box
            ref={wrapRef}
            aria-hidden="true"
            sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 0,
                borderRadius: "inherit",
                // Overall visibility is controlled by the card's `.cap-bg`
                // wrapper (which brightens on hover) — keep this layer at full.
                opacity: 1,
                // fade the art out behind the text block at the top-left
                maskImage: "radial-gradient(120% 100% at 100% 100%, #000 35%, rgba(0,0,0,0.35) 100%)",
                WebkitMaskImage: "radial-gradient(120% 100% at 100% 100%, #000 35%, rgba(0,0,0,0.35) 100%)",
            }}
        >
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
