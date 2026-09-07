import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Animated hero background for the Data & Storage Optimization service page:
// a rotating geometric DATA MANDALA. Concentric rings — dashed circles, dot
// rings, polygons and tick marks — counter-rotate at different speeds around a
// glowing core, a segmented outer ring is swept by a bright "read head" (a disk
// being read/optimized), small data blocks orbit with arc trails, and a radial
// pulse breathes out every few seconds. Indigo-violet accent (this service's
// palette) over a faint engineering grid, so it feels like a sibling of the AI
// rocket scene but reads unmistakably as DATA. Pure <canvas> +
// requestAnimationFrame (no library), time-based motion, paused while the hero
// is off-screen, and a single static frame under prefers-reduced-motion.
// Scoped absolute inside the relative hero, click-through, behind the content.

// This service's accent family (see src/data/services.js: data-storage).
const LIGHT = "165,180,252"; // #A5B4FC
const MID = "124,107,245"; // #7C6BF5
const DEEP = "79,70,229"; // #4F46E5
const GLOW = "224,231,255"; // #E0E7FF

export default function DataHeroBg() {
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
        let segments = []; // the segmented "disk" ring
        let pulses = [];
        let nextPulse = 2.5;

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

        // Random arc segments with gaps, like sectors on a disk platter.
        const initSegments = () => {
            segments = [];
            let a = 0;
            while (a < Math.PI * 2 - 0.15) {
                const len = rand(0.18, 0.55);
                segments.push({ start: a, len: Math.min(len, Math.PI * 2 - a), alpha: rand(0.3, 0.6) });
                a += len + rand(0.06, 0.16);
            }
        };

        // Small data blocks orbiting between the rings.
        const ORBITERS = [
            { rf: 0.5, speed: 0.22, phase: rand(0, Math.PI * 2), size: 4.6 },
            { rf: 0.66, speed: -0.15, phase: rand(0, Math.PI * 2), size: 5.4 },
            { rf: 0.82, speed: 0.1, phase: rand(0, Math.PI * 2), size: 4 },
        ];

        /* ── mandala drawing ─────────────────────────────────────────────── */

        const dotRing = (r, n, base, dotR, alpha) => {
            for (let i = 0; i < n; i++) {
                const a = base + (i / n) * Math.PI * 2;
                const bright = i % 4 === 0;
                ctx.fillStyle = bright ? `rgba(${GLOW},${(alpha * 1.5).toFixed(3)})` : `rgba(${LIGHT},${alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(r * Math.cos(a), r * Math.sin(a), bright ? dotR * 1.35 : dotR, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const tickRing = (r1, r2, n, base, alpha, width = 1) => {
            ctx.strokeStyle = `rgba(${LIGHT},${alpha.toFixed(3)})`;
            ctx.lineWidth = width;
            ctx.beginPath();
            for (let i = 0; i < n; i++) {
                const a = base + (i / n) * Math.PI * 2;
                ctx.moveTo(r1 * Math.cos(a), r1 * Math.sin(a));
                ctx.lineTo(r2 * Math.cos(a), r2 * Math.sin(a));
            }
            ctx.stroke();
        };

        const polyRing = (r, sides, base, alpha, vertexDots = true) => {
            ctx.strokeStyle = `rgba(${MID},${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const a = base + (i / sides) * Math.PI * 2;
                const x = r * Math.cos(a), y = r * Math.sin(a);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
            if (vertexDots) {
                ctx.fillStyle = `rgba(${LIGHT},${(alpha * 1.6).toFixed(3)})`;
                for (let i = 0; i < sides; i++) {
                    const a = base + (i / sides) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.arc(r * Math.cos(a), r * Math.sin(a), 1.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };

        const dashedRing = (r, base, alpha, dash = 10, gap = 8) => {
            ctx.save();
            ctx.rotate(base);
            ctx.strokeStyle = `rgba(${MID},${alpha.toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.setLineDash([dash, gap]);
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        };

        const frame = (now) => {
            const t = now / 1000;
            const dt = Math.min(0.05, Math.max(0.001, t - (lastT || t)));
            lastT = t;

            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h * 0.54;
            const R = Math.min(w, h) * 0.52;

            ctx.save();
            ctx.translate(cx, cy);

            // radial pulses — a soft "heartbeat" expanding from the core
            nextPulse -= dt;
            if (nextPulse <= 0 && !reduce) {
                pulses.push({ age: 0 });
                nextPulse = rand(3.5, 5.5);
            }
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.age += dt;
                const f = p.age / 3; // 3s to cross the mandala
                if (f >= 1) { pulses.splice(i, 1); continue; }
                ctx.strokeStyle = `rgba(${LIGHT},${(0.3 * (1 - f)).toFixed(3)})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, 0, f * R * 0.95, 0, Math.PI * 2);
                ctx.stroke();
            }

            // glowing core
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.1);
            core.addColorStop(0, `rgba(${GLOW},0.5)`);
            core.addColorStop(0.4, `rgba(${MID},0.25)`);
            core.addColorStop(1, `rgba(${DEEP},0)`);
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(0, 0, R * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // inner rings — kept faint: the hero copy sits over this area
            dashedRing(R * 0.14, t * 0.1, 0.2, 6, 7);
            dotRing(R * 0.22, 18, -t * 0.07, 1.4, 0.2);
            polyRing(R * 0.3, 6, t * 0.05, 0.18);

            // mid rings
            tickRing(R * 0.375, R * 0.4, 48, -t * 0.06, 0.38);
            dashedRing(R * 0.44, -t * 0.045, 0.32, 14, 10);

            // segmented "disk" ring + sweeping read head
            const segR = R * 0.55;
            ctx.lineWidth = 3;
            ctx.lineCap = "butt";
            const segBase = t * 0.03;
            for (const s of segments) {
                ctx.strokeStyle = `rgba(${MID},${s.alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(0, 0, segR, segBase + s.start, segBase + s.start + s.len);
                ctx.stroke();
            }
            ctx.save(); // the read head — a bright arc sweeping the sectors
            ctx.globalCompositeOperation = "lighter";
            const head = t * 0.55;
            const hg = ctx.createLinearGradient(
                segR * Math.cos(head - 0.5), segR * Math.sin(head - 0.5),
                segR * Math.cos(head), segR * Math.sin(head)
            );
            hg.addColorStop(0, `rgba(${GLOW},0)`);
            hg.addColorStop(1, `rgba(${GLOW},0.85)`);
            ctx.strokeStyle = hg;
            ctx.lineWidth = 3.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.arc(0, 0, segR, head - 0.5, head);
            ctx.stroke();
            ctx.fillStyle = `rgba(${GLOW},0.95)`; // head dot
            ctx.beginPath();
            ctx.arc(segR * Math.cos(head), segR * Math.sin(head), 2.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // outer rings
            polyRing(R * 0.66, 12, -t * 0.03, 0.24, false);
            dotRing(R * 0.74, 36, t * 0.04, 1.3, 0.3);
            tickRing(R * 0.86, R * 0.895, 72, t * 0.02, 0.26);
            ctx.strokeStyle = `rgba(${DEEP},0.32)`; // outermost hairline
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, R * 0.92, 0, Math.PI * 2);
            ctx.stroke();

            // orbiting data blocks with arc trails
            for (const o of ORBITERS) {
                const a = o.phase + t * o.speed;
                const r = R * o.rf;
                const x = r * Math.cos(a), y = r * Math.sin(a);
                ctx.save();
                ctx.globalCompositeOperation = "lighter";
                const dir = Math.sign(o.speed);
                const tg = ctx.createLinearGradient(
                    r * Math.cos(a - dir * 0.4), r * Math.sin(a - dir * 0.4), x, y
                );
                tg.addColorStop(0, `rgba(${MID},0)`);
                tg.addColorStop(1, `rgba(${LIGHT},0.5)`);
                ctx.strokeStyle = tg;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                dir > 0 ? ctx.arc(0, 0, r, a - 0.4, a) : ctx.arc(0, 0, r, a, a + 0.4);
                ctx.stroke();
                // the block — a small glowing diamond
                ctx.translate(x, y);
                ctx.rotate(a + Math.PI / 4);
                const bg = ctx.createRadialGradient(0, 0, 0, 0, 0, o.size * 2);
                bg.addColorStop(0, `rgba(${GLOW},0.9)`);
                bg.addColorStop(1, `rgba(${MID},0)`);
                ctx.fillStyle = bg;
                ctx.beginPath();
                ctx.arc(0, 0, o.size * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `rgba(${GLOW},0.95)`;
                ctx.fillRect(-o.size / 2, -o.size / 2, o.size, o.size);
                ctx.restore();
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
        initSegments();
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
                initSegments();
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
                // faint engineering grid — square "storage blocks" texture
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(165,180,252,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(165,180,252,0.05) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                    maskImage: "radial-gradient(ellipse at 50% 45%, #000 20%, transparent 78%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, #000 20%, transparent 78%)",
                },
            }}
        >
            {/* Accent nebula glows behind the mandala */}
            <Box
                sx={{
                    position: "absolute",
                    top: "-12%",
                    left: "-6%",
                    width: { xs: 380, md: 560 },
                    height: { xs: 380, md: 560 },
                    background: "radial-gradient(circle at center, rgba(124,107,245,0.30) 0%, rgba(124,107,245,0) 70%)",
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
                    background: "radial-gradient(circle at center, rgba(79,70,229,0.30) 0%, rgba(79,70,229,0) 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
