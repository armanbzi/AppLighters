import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Animated hero background for the Cloud & Scalability service page: layered
// line-art CLOUDS drift by at different depths while an AUTO-SCALING cluster
// of server nodes grows and shrinks with a demand curve — nodes pop in with a
// glow when scaling up and fade out when scaling down, a chevron flashes the
// direction, and data packets stream between the cluster and its cloud.
// Indigo→sky accent (this service's palette) over a faint plus-sign field.
// Pure <canvas> + requestAnimationFrame (no library), time-based motion,
// paused while the hero is off-screen, and a single static frame under
// prefers-reduced-motion. Scoped absolute inside the relative hero,
// click-through, behind the content.

// This service's accent family (see src/data/services.js: cloud-scaling).
const INDIGO = "129,140,248"; // #818CF8
const SKY = "56,189,248"; // #38BDF8
const LIGHT = "224,242,254"; // #E0F2FE

export default function CloudHeroBg() {
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
        let clouds = [], pluses = [], packets = [], nodes = [];
        let cluster = null, indicator = null, lastCount = 0;

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

        const initScene = () => {
            // drifting line-art clouds: {x, y, s(ize), v, alpha}
            clouds = [
                { x: w * 0.16, y: h * 0.2, s: 120, v: 7, a: 0.22 },
                { x: w * 0.55, y: h * 0.13, s: 80, v: 11, a: 0.16 },
                { x: w * 0.32, y: h * 0.62, s: 95, v: 5, a: 0.2 },
                { x: w * 0.68, y: h * 0.3, s: 65, v: 13, a: 0.14 },
                { x: w * 0.06, y: h * 0.42, s: 74, v: 9, a: 0.17 },
            ];

            // faint plus-sign field
            pluses = Array.from({ length: Math.round(Math.min(60, w / 26)) }, () => ({
                x: rand(0, w),
                y: rand(h * 0.06, h * 0.96),
                s: rand(3, 5.5),
                a: rand(0.05, 0.11),
            }));

            // the auto-scaling cluster (bottom-right) and its home cloud
            const cell = 21;
            cluster = {
                ox: w * 0.76,
                oy: h * 0.64,
                cell,
                cols: 4,
                max: 12,
                cloudX: w * 0.76 + cell * 1.5,
                cloudY: h * 0.36,
                cloudS: 130,
            };
            nodes = Array.from({ length: cluster.max }, () => ({ scale: 0 }));
            for (let i = 0; i < 6; i++) nodes[i].scale = 1; // start mid-scale
            lastCount = 6;
            indicator = null;

            packets = Array.from({ length: 4 }, (_, i) => ({
                u: rand(0, 1),
                dir: i % 2 === 0 ? 1 : -1, // 1 = up to the cloud
                sway: rand(0, Math.PI * 2),
                speed: rand(0.25, 0.4),
            }));
        };

        /* ── drawing helpers ─────────────────────────────────────────────── */

        // classic three-arc cloud, stroked line-art with a whisper of fill
        const cloudPath = (s) => {
            ctx.beginPath();
            ctx.arc(-0.25 * s, 0, 0.25 * s, Math.PI * 0.5, Math.PI * 1.5);
            ctx.arc(0.02 * s, -0.14 * s, 0.3 * s, Math.PI * 1.05, Math.PI * 1.95);
            ctx.arc(0.28 * s, 0, 0.23 * s, Math.PI * 1.5, Math.PI * 0.5);
            ctx.closePath();
        };

        const drawCloud = (c) => {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.fillStyle = `rgba(${SKY},${(c.a * 0.16).toFixed(3)})`;
            ctx.strokeStyle = `rgba(${INDIGO},${c.a.toFixed(3)})`;
            ctx.lineWidth = 1.4;
            cloudPath(c.s);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        };

        const drawPluses = () => {
            ctx.strokeStyle = `rgba(${LIGHT},1)`;
            ctx.lineWidth = 1;
            for (const p of pluses) {
                ctx.globalAlpha = p.a;
                ctx.beginPath();
                ctx.moveTo(p.x - p.s, p.y);
                ctx.lineTo(p.x + p.s, p.y);
                ctx.moveTo(p.x, p.y - p.s);
                ctx.lineTo(p.x, p.y + p.s);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        };

        const demandAt = (t) =>
            Math.min(1, Math.max(0, 0.5 + 0.3 * Math.sin(t * 0.11) + 0.24 * Math.sin(t * 0.053 + 1.7)));

        const drawCluster = (t, dt) => {
            const { ox, oy, cell, cols, max } = cluster;
            const target = Math.max(2, Math.min(max, 2 + Math.round(demandAt(t) * (max - 2))));
            if (target !== lastCount) {
                indicator = { dir: target > lastCount ? -1 : 1, age: 0 }; // -1 = up chevron
                lastCount = target;
            }

            for (let i = 0; i < max; i++) {
                const n = nodes[i];
                const on = i < target;
                n.scale += ((on ? 1 : 0) - n.scale) * Math.min(1, dt * 5);
                if (n.scale < 0.03) continue;

                const x = ox + (i % cols) * cell;
                const y = oy + Math.floor(i / cols) * cell;
                const S = 13 * n.scale;
                ctx.save();
                ctx.translate(x, y);

                if (n.scale < 0.95 && on) { // spawn glow
                    ctx.save();
                    ctx.globalCompositeOperation = "lighter";
                    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 14);
                    g.addColorStop(0, `rgba(${SKY},0.45)`);
                    g.addColorStop(1, `rgba(${SKY},0)`);
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(0, 0, 14, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }

                const grad = ctx.createLinearGradient(0, -S / 2, 0, S / 2);
                grad.addColorStop(0, `rgba(${LIGHT},${(0.55 * n.scale).toFixed(3)})`);
                grad.addColorStop(1, `rgba(${SKY},${(0.3 * n.scale).toFixed(3)})`);
                ctx.fillStyle = grad;
                ctx.strokeStyle = `rgba(${LIGHT},${(0.7 * n.scale).toFixed(3)})`;
                ctx.lineWidth = 1.1;
                const r = 3;
                ctx.beginPath();
                ctx.moveTo(-S / 2 + r, -S / 2);
                ctx.arcTo(S / 2, -S / 2, S / 2, S / 2, r);
                ctx.arcTo(S / 2, S / 2, -S / 2, S / 2, r);
                ctx.arcTo(-S / 2, S / 2, -S / 2, -S / 2, r);
                ctx.arcTo(-S / 2, -S / 2, S / 2, -S / 2, r);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // tiny status dot
                ctx.fillStyle = `rgba(${SKY},${(0.9 * n.scale).toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(S / 2 - 3.2, -S / 2 + 3.2, 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // scale-direction chevron above the cluster
            if (indicator) {
                indicator.age += dt;
                if (indicator.age > 0.9) indicator = null;
                else {
                    const f = 1 - indicator.age / 0.9;
                    const cxI = ox + cell * 1.5;
                    const cyI = oy - 24 + indicator.dir * 6 * (1 - f);
                    ctx.strokeStyle = indicator.dir < 0 ? `rgba(${SKY},${(0.9 * f).toFixed(3)})` : `rgba(${INDIGO},${(0.9 * f).toFixed(3)})`;
                    ctx.lineWidth = 2;
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                    ctx.beginPath();
                    ctx.moveTo(cxI - 7, cyI + 3.5 * -indicator.dir);
                    ctx.lineTo(cxI, cyI + 3.5 * indicator.dir);
                    ctx.lineTo(cxI + 7, cyI + 3.5 * -indicator.dir);
                    ctx.stroke();
                }
            }
        };

        const drawPackets = (dt) => {
            const { cloudX, cloudY, cloudS, ox, oy, cell } = cluster;
            const y0 = cloudY + cloudS * 0.28; // cloud underside
            const y1 = oy - 16; // cluster top
            const baseX = ox + cell * 1.5;
            for (const p of packets) {
                p.u += p.dir * p.speed * dt;
            }
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            for (const p of packets) {
                if (p.u > 1) p.u -= 1;
                if (p.u < 0) p.u += 1;
                const y = y1 + (y0 - y1) * p.u;
                const x = baseX + Math.sin(p.u * Math.PI * 2 + p.sway) * 9;
                const fade = Math.sin(p.u * Math.PI); // fade at both ends
                ctx.fillStyle = `rgba(${p.dir > 0 ? SKY : INDIGO},${(0.75 * fade).toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(x, y, 2.1, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = `rgba(${LIGHT},${(0.3 * fade).toFixed(3)})`;
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(x, y + p.dir * 7);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            ctx.restore();
        };

        /* ── frame loop ──────────────────────────────────────────────────── */

        const frame = (now) => {
            const t = now / 1000;
            const dt = Math.min(0.05, Math.max(0.001, t - (lastT || t)));
            lastT = t;

            ctx.clearRect(0, 0, w, h);

            drawPluses();

            for (const c of clouds) {
                c.x += c.v * dt;
                if (c.x - c.s > w + 60) c.x = -c.s - 60;
                drawCloud(c);
            }

            // the cluster's home cloud (slightly stronger than the drifters)
            drawCloud({ x: cluster.cloudX, y: cluster.cloudY, s: cluster.cloudS, a: 0.3 });

            drawPackets(dt);
            drawCluster(t, dt);

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
            sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}
        >
            {/* Accent nebula glows */}
            <Box
                sx={{
                    position: "absolute",
                    top: "-12%",
                    left: "-6%",
                    width: { xs: 380, md: 560 },
                    height: { xs: 380, md: 560 },
                    background: "radial-gradient(circle at center, rgba(129,140,248,0.30) 0%, rgba(129,140,248,0) 70%)",
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
                    background: "radial-gradient(circle at center, rgba(56,189,248,0.26) 0%, rgba(56,189,248,0) 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
