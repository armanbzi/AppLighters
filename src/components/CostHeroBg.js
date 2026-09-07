import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Animated hero background for the Cost Optimization service page: rectilinear
// chart geometry (deliberately different from the Data page's radial mandala).
// A skyline of cost bars breathes along the bottom while a teal "optimization
// wave" sweeps through and squashes them; a stepped, descending trend line is
// ridden by a glowing tracer dot; hexagonal cost tokens stamped with a
// down-chevron drift slowly down and fade out. Violet→teal accent (this
// service's palette) over faint ledger lines. Pure <canvas> +
// requestAnimationFrame (no library), time-based motion, paused while the hero
// is off-screen, and a single static frame under prefers-reduced-motion.
// Scoped absolute inside the relative hero, click-through, behind the content.

// This service's accent family (see src/data/services.js: cost-optimization).
const VIOLET = "168,85,247"; // #A855F7
const TEAL = "34,193,166"; // #22C1A6
const GLOW = "236,253,248"; // near-white teal

export default function CostHeroBg() {
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
        let bars = [], tokens = [], trend = null;

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

        /* ── scene setup ─────────────────────────────────────────────────── */

        const initBars = () => {
            const count = Math.max(14, Math.min(30, Math.round(w / 52)));
            const left = w * 0.05, right = w * 0.95;
            const step = (right - left) / count;
            bars = Array.from({ length: count }, (_, i) => ({
                x: left + i * step + step / 2,
                width: step * 0.52,
                base: rand(0.08, 0.23), // resting height as a fraction of h — capped so bars stay below the tagline
                amp: rand(0.02, 0.06),
                phase: rand(0, Math.PI * 2),
            }));
        };

        // A descending staircase: short plateaus, then drops — each step a win.
        const initTrend = () => {
            const pts = [];
            const x0 = w * 0.07, x1 = w * 0.93;
            const y0 = h * 0.3, y1 = h * 0.68;
            const steps = 5;
            const runW = (x1 - x0) / steps;
            let y = y0;
            pts.push({ x: x0, y });
            for (let i = 0; i < steps; i++) {
                const xEnd = x0 + (i + 1) * runW;
                pts.push({ x: xEnd - runW * rand(0.25, 0.4), y }); // plateau
                y = y0 + ((y1 - y0) * (i + 1)) / steps + rand(-8, 8);
                pts.push({ x: xEnd, y }); // drop landing
            }
            // cumulative lengths for parametric travel
            let total = 0;
            const lens = [0];
            for (let i = 1; i < pts.length; i++) {
                total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
                lens.push(total);
            }
            trend = { pts, lens, total };
        };

        const pointAt = (u) => {
            const d = u * trend.total;
            const { pts, lens } = trend;
            for (let i = 1; i < pts.length; i++) {
                if (d <= lens[i]) {
                    const f = (d - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
                    return {
                        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f,
                        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f,
                    };
                }
            }
            return pts[pts.length - 1];
        };

        const spawnToken = (initial) => ({
            x: rand(w * 0.08, w * 0.92),
            y: initial ? rand(h * 0.15, h * 0.6) : h * 0.12,
            size: rand(7, 12),
            fall: rand(7, 14),
            sway: rand(0, Math.PI * 2),
            spin: rand(-0.3, 0.3),
        });

        const initTokens = () => {
            tokens = Array.from({ length: w < 700 ? 4 : 6 }, () => spawnToken(true));
        };

        /* ── drawing ─────────────────────────────────────────────────────── */

        const drawBars = (t) => {
            const baseY = h * 0.9;
            const waveSpan = w * 1.3;
            const waveX = ((t * w * 0.09) % waveSpan) - w * 0.15; // sweeps every ~14s
            const sigma = w * 0.06;

            // baseline
            ctx.strokeStyle = `rgba(${VIOLET},0.25)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(w * 0.04, baseY);
            ctx.lineTo(w * 0.96, baseY);
            ctx.stroke();

            for (const b of bars) {
                const breathe = b.base + b.amp * Math.sin(t * 0.25 + b.phase);
                const g = Math.exp(-((b.x - waveX) ** 2) / (2 * sigma * sigma));
                const height = h * breathe * (1 - 0.38 * g); // the wave squashes costs
                const top = baseY - height;

                const grad = ctx.createLinearGradient(0, top, 0, baseY);
                grad.addColorStop(0, `rgba(${TEAL},${(0.4 + 0.35 * g).toFixed(3)})`);
                grad.addColorStop(0.45, `rgba(${VIOLET},0.3)`);
                grad.addColorStop(1, `rgba(${VIOLET},0.06)`);
                ctx.fillStyle = grad;
                const rTop = Math.min(4, b.width / 2);
                ctx.beginPath();
                ctx.moveTo(b.x - b.width / 2, baseY);
                ctx.lineTo(b.x - b.width / 2, top + rTop);
                ctx.quadraticCurveTo(b.x - b.width / 2, top, b.x - b.width / 2 + rTop, top);
                ctx.lineTo(b.x + b.width / 2 - rTop, top);
                ctx.quadraticCurveTo(b.x + b.width / 2, top, b.x + b.width / 2, top + rTop);
                ctx.lineTo(b.x + b.width / 2, baseY);
                ctx.closePath();
                ctx.fill();

                // cap highlight — flashes teal as the wave passes
                ctx.fillStyle = `rgba(${GLOW},${(0.25 + 0.6 * g).toFixed(3)})`;
                ctx.fillRect(b.x - b.width / 2, top, b.width, 1.6);

                if (g > 0.45) { // additive glow on actively-optimized bars
                    ctx.save();
                    ctx.globalCompositeOperation = "lighter";
                    const glow = ctx.createRadialGradient(b.x, top, 0, b.x, top, 16);
                    glow.addColorStop(0, `rgba(${TEAL},${(0.4 * g).toFixed(3)})`);
                    glow.addColorStop(1, `rgba(${TEAL},0)`);
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(b.x, top, 16, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        };

        const drawTrend = (t) => {
            const { pts } = trend;
            // the line itself
            ctx.strokeStyle = `rgba(${VIOLET},0.45)`;
            ctx.lineWidth = 1.5;
            ctx.lineJoin = "round";
            ctx.beginPath();
            pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
            ctx.stroke();
            // step-landing dots
            ctx.fillStyle = `rgba(${TEAL},0.7)`;
            for (let i = 2; i < pts.length; i += 2) {
                ctx.beginPath();
                ctx.arc(pts[i].x, pts[i].y, 2.2, 0, Math.PI * 2);
                ctx.fill();
            }

            // tracer riding the line down, with a short bright trail
            const u = (t * 0.07) % 1;
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.lineCap = "round";
            const TRAIL = 10;
            for (let i = 0; i < TRAIL; i++) {
                const uA = Math.max(0, u - 0.05 + (i / TRAIL) * 0.05);
                const uB = Math.max(0, u - 0.05 + ((i + 1) / TRAIL) * 0.05);
                const a = pointAt(uA), b = pointAt(uB);
                ctx.strokeStyle = `rgba(${GLOW},${((i / TRAIL) * 0.55).toFixed(3)})`;
                ctx.lineWidth = 1 + (i / TRAIL) * 2.2;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
            const head = pointAt(u);
            const hg = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 9);
            hg.addColorStop(0, `rgba(${GLOW},0.95)`);
            hg.addColorStop(0.4, `rgba(${TEAL},0.5)`);
            hg.addColorStop(1, `rgba(${TEAL},0)`);
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.arc(head.x, head.y, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        const drawToken = (tk, t) => {
            const x = tk.x + Math.sin(t * 0.8 + tk.sway) * 10;
            const fade =
                Math.min(1, (tk.y - h * 0.1) / (h * 0.08)) * // fade in at the top
                Math.min(1, Math.max(0, (h * 0.82 - tk.y) / (h * 0.1))); // fade out near the bars
            if (fade <= 0) return;
            ctx.save();
            ctx.translate(x, tk.y);
            ctx.rotate(Math.sin(t * 0.5 + tk.sway) * 0.15 * (tk.spin > 0 ? 1 : -1));
            ctx.globalAlpha = fade;

            // hexagon token
            ctx.strokeStyle = `rgba(${TEAL},0.75)`;
            ctx.fillStyle = `rgba(${TEAL},0.1)`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            for (let i = 0; i <= 6; i++) {
                const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const px = tk.size * Math.cos(a), py = tk.size * Math.sin(a);
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // down-chevron — costs going down
            const s = tk.size * 0.45;
            ctx.strokeStyle = `rgba(${GLOW},0.9)`;
            ctx.lineWidth = 1.6;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(-s, -s * 0.5);
            ctx.lineTo(0, s * 0.35);
            ctx.lineTo(s, -s * 0.5);
            ctx.stroke();

            ctx.restore();
        };

        /* ── frame loop ──────────────────────────────────────────────────── */

        const frame = (now) => {
            const t = now / 1000;
            const dt = Math.min(0.05, Math.max(0.001, t - (lastT || t)));
            lastT = t;

            ctx.clearRect(0, 0, w, h);

            drawTrend(t);
            drawBars(t);

            for (const tk of tokens) {
                tk.y += tk.fall * dt;
                if (tk.y > h * 0.86) Object.assign(tk, spawnToken(false));
                drawToken(tk, t);
            }

            if (running && !reduce) raf = requestAnimationFrame(frame);
        };

        /* ── lifecycle ───────────────────────────────────────────────────── */

        const start = () => {
            if (raf) cancelAnimationFrame(raf);
            lastT = 0;
            raf = requestAnimationFrame(frame);
        };

        const initAll = () => {
            initBars();
            initTrend();
            initTokens();
        };

        resize();
        initAll();
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
                initAll();
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
                // faint horizontal ledger lines — the "spreadsheet" texture
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "repeating-linear-gradient(180deg, rgba(34,193,166,0.05) 0px, rgba(34,193,166,0.05) 1px, transparent 1px, transparent 52px)",
                    maskImage: "radial-gradient(ellipse at 50% 55%, #000 25%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 55%, #000 25%, transparent 80%)",
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
                    background: "radial-gradient(circle at center, rgba(168,85,247,0.30) 0%, rgba(168,85,247,0) 70%)",
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
                    background: "radial-gradient(circle at center, rgba(34,193,166,0.22) 0%, rgba(34,193,166,0) 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
