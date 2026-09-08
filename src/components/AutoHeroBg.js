import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Animated hero background for the Automation & DevOps service page: the
// iconic DEVOPS INFINITY LOOP. A large glowing lemniscate sits behind the hero
// content — the left "Dev" lobe in indigo flowing into the right "Ops" lobe in
// blue — with bright particles streaming around it in both lobes, six station
// nodes that pulse as particles pass, and a breathing glow at the crossover.
// Two faint gears keep turning in the corners. Indigo→blue accent (this
// service's palette) over a faint diagonal lattice. Pure <canvas> +
// requestAnimationFrame (no library), time-based motion, paused while the hero
// is off-screen, and a single static frame under prefers-reduced-motion.
// Scoped absolute inside the relative hero, click-through, behind the content.

// This service's accent family (see src/data/services.js: automation).
const INDIGO = "99,102,241"; // #6366F1
const BLUE = "59,130,246"; // #3B82F6
const LIGHT = "219,234,254"; // #DBEAFE

export default function AutoHeroBg() {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas || typeof window === "undefined") return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        let w = 0, h = 0, raf = 0, running = true, lastT = 0;
        let loop = null, particles = [];

        const rand = (a, b) => a + Math.random() * (b - a);

        const resize = () => {
            const r = wrap.getBoundingClientRect();
            w = Math.max(1, r.width);
            h = Math.max(1, r.height);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        /* ── the lemniscate (∞) ──────────────────────────────────────────── */

        // Lemniscate of Bernoulli, u ∈ [0, 2π). Crossover at u = π/2 and 3π/2.
        const lem = (u) => {
            const s = Math.sin(u), c = Math.cos(u);
            const d = 1 + s * s;
            return { x: loop.cx + (loop.a * c) / d, y: loop.cy + (loop.a * s * c) / d };
        };

        const initScene = () => {
            loop = {
                cx: w / 2,
                cy: h * 0.56,
                a: Math.min(w * 0.38, h * 0.72),
                // six stations around the loop, clear of the crossover
                stations: [0, 0.85, 2.3, Math.PI, Math.PI + 0.85, Math.PI + 2.3],
            };
            particles = Array.from({ length: 9 }, (_, i) => ({
                u: (i / 9) * Math.PI * 2,
                speed: rand(0.32, 0.5),
                jitter: rand(0, Math.PI * 2),
            }));
        };

        const gearOutline = (R, teeth) => {
            const step = (Math.PI * 2) / teeth;
            const inner = R * 0.8;
            ctx.beginPath();
            for (let i = 0; i < teeth; i++) {
                const a = i * step;
                const p = [
                    [inner, a],
                    [R, a + step * 0.15],
                    [R, a + step * 0.45],
                    [inner, a + step * 0.6],
                ];
                for (const [r, ang] of p) {
                    const x = r * Math.cos(ang), y = r * Math.sin(ang);
                    i === 0 && ang === a ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
        };

        const drawBigGear = (x, y, R, teeth, angle, alpha) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.strokeStyle = `rgba(${INDIGO},${alpha.toFixed(3)})`;
            ctx.lineWidth = 1.2;
            gearOutline(R, teeth);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, R * 0.32, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        };

        const strokeLoop = (width, alpha, composite) => {
            ctx.save();
            if (composite) ctx.globalCompositeOperation = composite;
            const grad = ctx.createLinearGradient(loop.cx - loop.a, 0, loop.cx + loop.a, 0);
            grad.addColorStop(0, `rgba(${INDIGO},${alpha})`);
            grad.addColorStop(0.5, `rgba(${LIGHT},${alpha * 0.85})`);
            grad.addColorStop(1, `rgba(${BLUE},${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = width;
            ctx.lineJoin = "round";
            ctx.beginPath();
            const N = 220;
            for (let i = 0; i <= N; i++) {
                const p = lem((i / N) * Math.PI * 2);
                i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        };

        const angDist = (a, b) => {
            let d = (a - b) % (Math.PI * 2);
            if (d > Math.PI) d -= Math.PI * 2;
            if (d < -Math.PI) d += Math.PI * 2;
            return Math.abs(d);
        };

        /* ── frame loop ──────────────────────────────────────────────────── */

        const frame = (now) => {
            const t = now / 1000;
            const dt = Math.min(0.05, Math.max(0.001, t - (lastT || t)));
            lastT = t;

            ctx.clearRect(0, 0, w, h);

            // corner gears, quieter than before
            drawBigGear(w * 0.9, h * 0.16, 46, 11, t * 0.12, 0.16);
            drawBigGear(w * 0.08, h * 0.85, 60, 13, -t * 0.09, 0.12);

            // the ∞ — one wide soft pass, one crisp core pass
            strokeLoop(7, 0.07, "lighter");
            strokeLoop(1.6, 0.5, null);

            // breathing crossover core
            const breathe = 0.5 + 0.5 * Math.sin(t * 1.6);
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            const cg = ctx.createRadialGradient(loop.cx, loop.cy, 0, loop.cx, loop.cy, 26 + breathe * 8);
            cg.addColorStop(0, `rgba(${LIGHT},${(0.28 + breathe * 0.18).toFixed(3)})`);
            cg.addColorStop(1, `rgba(${INDIGO},0)`);
            ctx.fillStyle = cg;
            ctx.beginPath();
            ctx.arc(loop.cx, loop.cy, 26 + breathe * 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // stations — pulse when a particle is passing through
            for (const su of loop.stations) {
                const pos = lem(su);
                let near = Math.PI;
                for (const p of particles) near = Math.min(near, angDist(p.u, su));
                const active = near < 0.16;
                const onDevSide = pos.x < loop.cx;
                const col = onDevSide ? INDIGO : BLUE;
                if (active) {
                    ctx.save();
                    ctx.globalCompositeOperation = "lighter";
                    const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 16);
                    g.addColorStop(0, `rgba(${col},0.5)`);
                    g.addColorStop(1, `rgba(${col},0)`);
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                ctx.strokeStyle = `rgba(${LIGHT},${active ? 0.95 : 0.5})`;
                ctx.lineWidth = 1.4;
                ctx.fillStyle = `rgba(${col},${active ? 0.85 : 0.35})`;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, active ? 5 : 3.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }

            // particles streaming around the loop with trails
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.lineCap = "round";
            for (const p of particles) {
                p.u = (p.u + p.speed * dt) % (Math.PI * 2);
                const head = lem(p.u);
                const onDevSide = head.x < loop.cx;
                const col = onDevSide ? INDIGO : BLUE;
                // trail
                const STEPS = 7;
                for (let k = 1; k <= STEPS; k++) {
                    const a = lem(p.u - k * 0.045);
                    const b = lem(p.u - (k - 1) * 0.045);
                    ctx.strokeStyle = `rgba(${col},${(0.5 * (1 - k / STEPS)).toFixed(3)})`;
                    ctx.lineWidth = Math.max(0.6, 2.6 * (1 - k / STEPS));
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
                // head
                const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 7);
                g.addColorStop(0, `rgba(${LIGHT},0.95)`);
                g.addColorStop(0.4, `rgba(${col},0.55)`);
                g.addColorStop(1, `rgba(${col},0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(head.x, head.y, 7, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            if (running && !reduce) raf = requestAnimationFrame(frame);
        };

        /* ── lifecycle ───────────────────────────────────────────────────── */

        const start = () => {
            if (raf) cancelAnimationFrame(raf);
            lastT = 0;
            raf = requestAnimationFrame(frame);
        };

        resize();
        initScene();
        if (reduce) {
            frame(performance.now()); // one static, fully composed frame
        } else {
            start();
        }

        // pause the loop while the hero is scrolled out of view
        let io;
        if (!reduce && typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    running = e.isIntersecting;
                    if (running) start();
                    else if (raf) cancelAnimationFrame(raf);
                });
            });
            io.observe(wrap);
        }

        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resize();
                initScene();
                if (reduce) frame(performance.now());
            }, 150);
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            clearTimeout(resizeTimer);
            if (io) io.disconnect();
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

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
                // faint diagonal lattice — the "engineered" texture
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(99,102,241,0.045) 0px, rgba(99,102,241,0.045) 1px, transparent 1px, transparent 56px)",
                    maskImage: "radial-gradient(ellipse at 50% 50%, #000 22%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 22%, transparent 80%)",
                },
            }}
        >
            {/* Accent nebula glows */}
            <Box
                sx={{
                    position: "absolute",
                    top: "-12%",
                    left: "-6%",
                    width: { xs: 380, md: 560 },
                    height: { xs: 380, md: 560 },
                    background: "radial-gradient(circle at center, rgba(99,102,241,0.30) 0%, rgba(99,102,241,0) 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "-14%",
                    right: "-6%",
                    width: { xs: 360, md: 560 },
                    height: { xs: 360, md: 560 },
                    background: "radial-gradient(circle at center, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
