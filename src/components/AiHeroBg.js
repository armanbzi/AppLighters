import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Animated hero background for the AI Integration service page: a structured
// DEEP NEURAL NETWORK that visibly thinks. Five node layers span the hero
// (input → hidden → output) joined by weight-graded connections; every couple
// of seconds a forward pass fires — signals race along the connections hop by
// hop, each layer lights up as the wave arrives, and the output layer pings
// expanding result rings. Connections shimmer softly between passes. Brand
// violet accent over a faint dot grid. Pure <canvas> + requestAnimationFrame
// (no library), time-based motion, paused while the hero is off-screen, and a
// single static frame under prefers-reduced-motion. Scoped absolute inside the
// relative hero, click-through, behind the content.

// This service's accent family (see src/data/services.js: ai-integration).
const VIOLET = "193,91,238"; // #C15BEE
const DEEP = "126,43,216"; // #7E2BD8
const GLOW = "243,232,255"; // #F3E8FF

const LAYER_COUNTS = [4, 6, 8, 6, 4];
const LAYER_XS = [0.08, 0.28, 0.5, 0.72, 0.92];
const HOP = 0.5; // seconds a signal takes to cross one layer gap
const LAG = 0.6; // seconds between successive hops starting

export default function AiHeroBg() {
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
        let layers = [], conns = [], passes = [];
        let passTimer = 0.6;

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

        const initScene = () => {
            layers = LAYER_COUNTS.map((n, l) => {
                const spacing = Math.min(0.64 / (n - 1), 0.14);
                return Array.from({ length: n }, (_, i) => {
                    const x = LAYER_XS[l] * w;
                    return {
                        x,
                        y: h * (0.5 + (i - (n - 1) / 2) * spacing),
                        r: l === 0 || l === LAYER_COUNTS.length - 1 ? 4.2 : 3.4,
                        tw: rand(0, Math.PI * 2),
                        gain: rand(0.55, 1), // per-node activation strength
                        // quiet the nodes that sit behind the hero copy column
                        damp: Math.min(1, Math.max(0.35, Math.abs(x - w / 2) / (w * 0.2))),
                    };
                });
            });
            conns = [];
            for (let l = 0; l < layers.length - 1; l++) {
                const list = [];
                for (let a = 0; a < layers[l].length; a++) {
                    for (let b = 0; b < layers[l + 1].length; b++) {
                        list.push({ a, b, wAlpha: rand(0.04, 0.15) });
                    }
                }
                conns.push(list);
            }
            passes = [];
            passTimer = 0.4;
        };

        // Activation envelope: quick rise, gentle decay.
        const env = (age) => {
            if (age < 0) return 0;
            if (age < 0.15) return age / 0.15;
            return Math.max(0, 1 - (age - 0.15) / 0.95);
        };
        const arrival = (p, l) => (l === 0 ? p.t0 : p.t0 + (l - 1) * LAG + HOP);
        const ease = (f) => (f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2);

        /* ── frame loop ──────────────────────────────────────────────────── */

        const frame = (now) => {
            const t = now / 1000;
            const dt = Math.min(0.05, Math.max(0.001, t - (lastT || t)));
            lastT = t;

            ctx.clearRect(0, 0, w, h);

            // fire a forward pass every couple of seconds
            passTimer -= dt;
            if (passTimer <= 0) {
                passes.push({ t0: t });
                passTimer = rand(2.2, 3.2);
            }
            passes = passes.filter((p) => t - p.t0 < (layers.length + 1) * LAG + 1.5);

            // connections, shimmering faintly
            for (let l = 0; l < conns.length; l++) {
                const shimmer = 0.78 + 0.22 * Math.sin(t * 0.5 + l * 1.3);
                for (const c of conns[l]) {
                    const A = layers[l][c.a], B = layers[l + 1][c.b];
                    ctx.strokeStyle = `rgba(${VIOLET},${(c.wAlpha * shimmer).toFixed(3)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(A.x, A.y);
                    ctx.lineTo(B.x, B.y);
                    ctx.stroke();
                }
            }

            // signals racing along the connections, hop by hop
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            for (const p of passes) {
                for (let l = 0; l < conns.length; l++) {
                    const prog = (t - p.t0 - l * LAG) / HOP;
                    if (prog <= 0 || prog >= 1) continue;
                    const f = ease(prog);
                    for (const c of conns[l]) {
                        if (c.wAlpha < 0.055) continue; // skip the weakest weights
                        const A = layers[l][c.a], B = layers[l + 1][c.b];
                        const x = A.x + (B.x - A.x) * f;
                        const y = A.y + (B.y - A.y) * f;
                        const a = Math.min(0.7, c.wAlpha * 5) * Math.sin(Math.PI * prog);
                        ctx.fillStyle = `rgba(${GLOW},${a.toFixed(3)})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 1.7, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            ctx.restore();

            // nodes: idle twinkle + activation glow as the wave arrives
            for (let l = 0; l < layers.length; l++) {
                const isOutput = l === layers.length - 1;
                for (const n of layers[l]) {
                    let act = 0;
                    for (const p of passes) act = Math.max(act, env(t - arrival(p, l)) * n.gain);

                    if (act > 0.02) {
                        ctx.save();
                        ctx.globalCompositeOperation = "lighter";
                        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4.5);
                        g.addColorStop(0, `rgba(${VIOLET},${(0.55 * act * n.damp).toFixed(3)})`);
                        g.addColorStop(1, `rgba(${DEEP},0)`);
                        ctx.fillStyle = g;
                        ctx.beginPath();
                        ctx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }

                    const idle = 0.45 + 0.15 * Math.sin(t * 1.2 + n.tw);
                    const core = Math.min(1, idle + act) * n.damp;
                    ctx.fillStyle = `rgba(${GLOW},${core.toFixed(3)})`;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, n.r * (1 + act * 0.35), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = `rgba(${VIOLET},${((0.35 + act * 0.5) * n.damp).toFixed(3)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, n.r * (1 + act * 0.35) + 1.6, 0, Math.PI * 2);
                    ctx.stroke();

                    // result pings from the output layer
                    if (isOutput) {
                        for (const p of passes) {
                            const age = t - arrival(p, l);
                            if (age > 0 && age < 0.8) {
                                ctx.strokeStyle = `rgba(${VIOLET},${(0.5 * (1 - age / 0.8) * n.gain).toFixed(3)})`;
                                ctx.lineWidth = 1.4;
                                ctx.beginPath();
                                ctx.arc(n.x, n.y, 6 + age * 26, 0, Math.PI * 2);
                                ctx.stroke();
                            }
                        }
                    }
                }
            }

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
                // faint dot grid — the "compute fabric" texture
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "radial-gradient(rgba(243,232,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "36px 36px",
                    maskImage: "radial-gradient(ellipse at 50% 50%, #000 20%, transparent 78%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 20%, transparent 78%)",
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
                    background: "radial-gradient(circle at center, rgba(193,91,238,0.30) 0%, rgba(193,91,238,0) 70%)",
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
                    background: "radial-gradient(circle at center, rgba(126,43,216,0.30) 0%, rgba(126,43,216,0) 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
