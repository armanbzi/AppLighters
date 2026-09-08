import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Animated hero background for the UI & UX Modernization service page: a
// DESIGN PASS sweeping the screen. Scattered mini app-screens sit as thin
// wireframes; a glowing brush band travels left to right and "paints" each one
// into a polished card (accent header, avatar, text, button) as it crosses.
// After a short hold everything eases back to wireframe and the pass repeats —
// before → after, on loop. Floating palette dots drift upward throughout.
// Pink→purple accent (this service's palette) over a faint layout-column grid.
// Pure <canvas> + requestAnimationFrame (no library), time-based motion,
// paused while the hero is off-screen, and a single static mid-sweep frame
// under prefers-reduced-motion. Scoped absolute inside the relative hero,
// click-through, behind the content.

// This service's accent family (see src/data/services.js: ui-ux).
const PINK = "244,114,182"; // #F472B6
const PURPLE = "168,85,247"; // #A855F7
const LIGHT = "253,242,250"; // near-white pink

const CYCLE = 7; // seconds per full paint pass
const FEATHER = 70; // px over which a tile transitions wireframe -> painted

// Normalized tile layout: scattered mini app-screens at varied sizes/tilts.
const TILES = [
    { x: 0.07, y: 0.2, w: 120, h: 86, rot: -3 },
    { x: 0.2, y: 0.62, w: 96, h: 70, rot: 2 },
    { x: 0.3, y: 0.3, w: 76, h: 58, rot: -2 },
    { x: 0.36, y: 0.82, w: 110, h: 80, rot: 3 },
    { x: 0.55, y: 0.18, w: 88, h: 64, rot: -4 },
    { x: 0.68, y: 0.68, w: 78, h: 58, rot: 2 },
    { x: 0.78, y: 0.28, w: 118, h: 86, rot: 3 },
    { x: 0.9, y: 0.66, w: 92, h: 68, rot: -2 },
];

const DOTS = [
    { x: 0.14, off: 0, sp: 0.05, r: 4, c: PINK },
    { x: 0.36, off: 0.4, sp: 0.04, r: 3, c: PURPLE },
    { x: 0.5, off: 0.7, sp: 0.06, r: 2.6, c: LIGHT },
    { x: 0.72, off: 0.2, sp: 0.045, r: 3.4, c: PINK },
    { x: 0.86, off: 0.55, sp: 0.055, r: 2.8, c: PURPLE },
];

export default function UiHeroBg() {
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

        let w = 0, h = 0, raf = 0, running = true;

        const rgba = (c, a) => `rgba(${c},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
        const ease = (f) => (f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2);

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

        const rr = (x, y, tw, th, r) => {
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, tw, th, r);
            else ctx.rect(x, y, tw, th);
        };

        // One mini app-screen. paint = 0 (wireframe) .. 1 (fully polished).
        const drawTile = (tile, paint) => {
            const tw = tile.w, th = tile.h;
            ctx.save();
            ctx.translate(tile.x * w, tile.y * h);
            ctx.rotate((tile.rot * Math.PI) / 180);
            ctx.translate(-tw / 2, -th / 2);

            // wireframe layer — always present, fades as the paint takes over
            const wf = 1 - paint * 0.75;
            ctx.strokeStyle = rgba(PINK, 0.3 * wf);
            ctx.lineWidth = 1;
            rr(0, 0, tw, th, 9);
            ctx.stroke();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = rgba(PINK, 0.22 * wf);
            ctx.beginPath();
            ctx.moveTo(9, 16); ctx.lineTo(tw - 9, 16);
            ctx.moveTo(9, th * 0.48); ctx.lineTo(tw - 9, th * 0.48);
            ctx.moveTo(9, th * 0.48 + 9); ctx.lineTo(tw * 0.62, th * 0.48 + 9);
            ctx.stroke();
            ctx.setLineDash([]);

            if (paint > 0.01) {
                ctx.globalAlpha = paint;
                // card body
                const g = ctx.createLinearGradient(0, 0, 0, th);
                g.addColorStop(0, rgba(PINK, 0.13));
                g.addColorStop(1, rgba(PURPLE, 0.07));
                ctx.fillStyle = g;
                rr(0, 0, tw, th, 9);
                ctx.fill();
                ctx.strokeStyle = rgba(PINK, 0.55);
                ctx.lineWidth = 1.2;
                rr(0, 0, tw, th, 9);
                ctx.stroke();
                // header bar
                const hg = ctx.createLinearGradient(0, 0, tw, 0);
                hg.addColorStop(0, rgba(PINK, 0.85));
                hg.addColorStop(1, rgba(PURPLE, 0.85));
                ctx.fillStyle = hg;
                rr(8, 9, tw * 0.42, 7, 3.5);
                ctx.fill();
                // avatar dot
                ctx.fillStyle = rgba(LIGHT, 0.9);
                ctx.beginPath();
                ctx.arc(tw - 15, 12.5, 5, 0, Math.PI * 2);
                ctx.fill();
                // text rows
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                rr(8, th * 0.42, tw - 16, 5, 2.5); ctx.fill();
                rr(8, th * 0.42 + 10, tw * 0.6, 5, 2.5); ctx.fill();
                // button pill
                const bg = ctx.createLinearGradient(0, 0, 30, 0);
                bg.addColorStop(0, rgba(PINK, 0.95));
                bg.addColorStop(1, rgba(PURPLE, 0.95));
                ctx.fillStyle = bg;
                rr(8, th - 17, 30, 9, 4.5);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            ctx.restore();
        };

        const frame = (now) => {
            const t = now / 1000;
            ctx.clearRect(0, 0, w, h);

            // where is the design pass? sweep, hold, then fade back
            const p = (t % CYCLE) / CYCLE;
            let sweepX = null;
            let fade = 1;
            if (p < 0.72) sweepX = -0.15 * w + 1.32 * w * ease(p / 0.72);
            else if (p < 0.88) sweepX = 1.2 * w; // hold, fully painted
            else { sweepX = 1.2 * w; fade = 1 - ease((p - 0.88) / 0.12); }

            // tiles
            for (const tile of TILES) {
                const paint = Math.max(0, Math.min(1, (sweepX - tile.x * w) / FEATHER)) * fade;
                drawTile(tile, paint);
            }

            // the brush band itself
            if (p < 0.72) {
                ctx.save();
                ctx.globalCompositeOperation = "lighter";
                const band = ctx.createLinearGradient(sweepX - 110, 0, sweepX + 26, 0);
                band.addColorStop(0, rgba(PURPLE, 0));
                band.addColorStop(0.55, rgba(PURPLE, 0.1));
                band.addColorStop(0.92, rgba(PINK, 0.22));
                band.addColorStop(1, rgba(PINK, 0));
                ctx.fillStyle = band;
                ctx.fillRect(sweepX - 110, 0, 136, h);
                ctx.strokeStyle = rgba(LIGHT, 0.5); // leading edge
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(sweepX, 0);
                ctx.lineTo(sweepX, h);
                ctx.stroke();
                ctx.restore();
            }

            // palette dots drifting upward
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            for (const d of DOTS) {
                const q = ((t * d.sp + d.off) % 1);
                const y = h * (0.95 - q * 0.85);
                const x = w * d.x + Math.sin(t * 0.7 + d.off * 9) * 14;
                const a = Math.sin(Math.PI * q) * 0.55;
                const g = ctx.createRadialGradient(x, y, 0, x, y, d.r * 3);
                g.addColorStop(0, rgba(d.c, a));
                g.addColorStop(1, rgba(d.c, 0));
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, d.r * 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            if (running && !reduce) raf = requestAnimationFrame(frame);
        };

        const start = () => { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };

        resize();
        if (reduce) {
            // static frame caught mid-sweep: half wireframe, half painted
            frame(CYCLE * 0.4 * 1000);
        } else {
            start();
        }

        let io;
        if (!reduce && typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver((es) => es.forEach((en) => {
                running = en.isIntersecting;
                if (running) start(); else if (raf) cancelAnimationFrame(raf);
            }));
            io.observe(wrap);
        }
        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { resize(); if (reduce) frame(CYCLE * 0.4 * 1000); }, 150);
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
                // faint layout-column grid — the design-tool texture
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "repeating-linear-gradient(90deg, rgba(244,114,182,0.05) 0px, rgba(244,114,182,0.05) 1px, transparent 1px, transparent 92px)",
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
                    background: "radial-gradient(circle at center, rgba(244,114,182,0.24) 0%, rgba(244,114,182,0) 70%)",
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
                    background: "radial-gradient(circle at center, rgba(168,85,247,0.28) 0%, rgba(168,85,247,0) 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
