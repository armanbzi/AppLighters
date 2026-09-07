import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Animated hero background for the Security & Reliability service page: a
// RADAR sweep anchored in the bottom-left corner scans the hero — threat blips
// ping in violet until the emerald beam passes over them and clears them into
// little checks — while a geometric SHIELD on the right breathes pulse rings,
// runs a scan line, and deflects incoming particles with a spark burst.
// Violet→emerald accent (this service's palette) over a faint diamond mesh.
// Pure <canvas> + requestAnimationFrame (no library), time-based motion,
// paused while the hero is off-screen, and a single static frame under
// prefers-reduced-motion. Scoped absolute inside the relative hero,
// click-through, behind the content.

// This service's accent family (see src/data/services.js: security-reliability).
const VIOLET = "139,92,246"; // #8B5CF6
const EMERALD = "16,185,129"; // #10B981
const LIGHT = "209,250,229"; // #D1FAE5

export default function SecurityHeroBg() {
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
        let radar = null, shield = null, blips = [], bursts = [], attacker = null;
        let blipTimer = 1.5, attackTimer = 3, pulseTimer = 1;
        let pulses = [];

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
            radar = { cx: w * 0.14, cy: h * 1.02, R: Math.min(w, h) * 0.9 };
            shield = {
                x: w < 700 ? w * 0.78 : w * 0.84,
                y: w < 700 ? h * 0.74 : h * 0.42,
                s: w < 700 ? 0.75 : 1,
                flash: 0,
            };
            blips = [];
            bursts = [];
            pulses = [];
            attacker = null;
            blipTimer = 0.5;
            attackTimer = 2.5;
            pulseTimer = 0.6;
        };

        /* ── radar ───────────────────────────────────────────────────────── */

        const spawnBlip = () => {
            for (let tries = 0; tries < 10; tries++) {
                const r = radar.R * rand(0.3, 0.85);
                const a = rand(-1.5, -0.12); // the visible up-right quadrant
                const x = radar.cx + r * Math.cos(a);
                const y = radar.cy + r * Math.sin(a);
                const clearOfShield = Math.hypot(x - shield.x, y - shield.y) > 120;
                if (x > 40 && x < w * 0.62 && y > h * 0.14 && y < h * 0.86 && clearOfShield) {
                    blips.push({ x, y, ang: a, born: 0, hit: false, hitAge: 0 });
                    return;
                }
            }
        };

        const angDiff = (a, b) => {
            let d = (a - b) % (Math.PI * 2);
            if (d > Math.PI) d -= Math.PI * 2;
            if (d < -Math.PI) d += Math.PI * 2;
            return Math.abs(d);
        };

        const drawRadar = (t, dt) => {
            const { cx, cy, R } = radar;
            ctx.save();
            ctx.translate(cx, cy);

            // rings + spokes
            for (let i = 1; i <= 4; i++) {
                ctx.strokeStyle = `rgba(${VIOLET},${(0.26 - i * 0.035).toFixed(3)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(0, 0, (R * i) / 4, -Math.PI, 0.2);
                ctx.stroke();
            }
            ctx.strokeStyle = `rgba(${VIOLET},0.16)`;
            for (const a of [-1.35, -0.9, -0.45]) {
                ctx.beginPath();
                ctx.moveTo(R * 0.12 * Math.cos(a), R * 0.12 * Math.sin(a));
                ctx.lineTo(R * Math.cos(a), R * Math.sin(a));
                ctx.stroke();
            }

            // rotating emerald sweep — a fading fan behind a bright leading edge
            const theta = t * 0.8;
            ctx.save();
            ctx.rotate(theta);
            ctx.globalCompositeOperation = "lighter";
            const SLICES = 7;
            for (let i = 0; i < SLICES; i++) {
                ctx.fillStyle = `rgba(${EMERALD},${(0.028 * (i + 1)).toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, R, -0.62 + (i / SLICES) * 0.62, -0.62 + ((i + 1) / SLICES) * 0.62);
                ctx.closePath();
                ctx.fill();
            }
            ctx.strokeStyle = `rgba(${LIGHT},0.55)`;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(R, 0);
            ctx.stroke();
            ctx.restore();
            ctx.restore();

            // blips
            blipTimer -= dt;
            if (blipTimer <= 0 && blips.length < 4) {
                spawnBlip();
                blipTimer = rand(2.5, 4);
            }
            for (let i = blips.length - 1; i >= 0; i--) {
                const b = blips[i];
                b.born += dt;
                if (!b.hit && angDiff(theta % (Math.PI * 2), b.ang) < 0.06 && b.born > 0.4) b.hit = true;
                if (b.hit) {
                    b.hitAge += dt;
                    if (b.hitAge > 1.5) { blips.splice(i, 1); continue; }
                }
                ctx.save();
                ctx.translate(b.x, b.y);
                if (!b.hit) {
                    // waiting threat: violet ping
                    const ping = (b.born % 1.6) / 1.6;
                    ctx.strokeStyle = `rgba(${VIOLET},${(0.5 * (1 - ping)).toFixed(3)})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.arc(0, 0, 4 + ping * 12, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.fillStyle = `rgba(${VIOLET},0.9)`;
                    ctx.beginPath();
                    ctx.arc(0, 0, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // cleared: emerald ring + check
                    const f = Math.min(1, b.hitAge / 0.35);
                    const fade = 1 - Math.max(0, (b.hitAge - 0.9) / 0.6);
                    ctx.globalAlpha = fade;
                    ctx.strokeStyle = `rgba(${EMERALD},0.6)`;
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.arc(0, 0, 4 + b.hitAge * 18, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.strokeStyle = `rgba(${LIGHT},0.95)`;
                    ctx.lineWidth = 2;
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                    ctx.beginPath();
                    ctx.moveTo(-4 * f, 0.5 * f);
                    ctx.lineTo(-1 * f, 3.4 * f);
                    ctx.lineTo(4.4 * f, -3 * f);
                    ctx.stroke();
                }
                ctx.restore();
            }
        };

        /* ── shield ──────────────────────────────────────────────────────── */

        const shieldPath = (k) => {
            ctx.beginPath();
            ctx.moveTo(-34 * k, -40 * k);
            ctx.lineTo(0, -52 * k);
            ctx.lineTo(34 * k, -40 * k);
            ctx.quadraticCurveTo(36 * k, 18 * k, 0, 52 * k);
            ctx.quadraticCurveTo(-36 * k, 18 * k, -34 * k, -40 * k);
            ctx.closePath();
        };

        const drawShield = (t, dt) => {
            const { x, y, s } = shield;
            shield.flash = Math.max(0, shield.flash - dt * 2);

            // expanding pulse rings
            pulseTimer -= dt;
            if (pulseTimer <= 0) {
                pulses.push({ age: 0 });
                pulseTimer = rand(2.4, 3.4);
            }
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.age += dt;
                const f = p.age / 2;
                if (f >= 1) { pulses.splice(i, 1); continue; }
                ctx.strokeStyle = `rgba(${EMERALD},${(0.35 * (1 - f)).toFixed(3)})`;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.arc(x, y, 58 * s + f * 70, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.save();
            ctx.translate(x, y);

            // aura + body
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 80 * s);
            g.addColorStop(0, `rgba(${EMERALD},${(0.12 + shield.flash * 0.25).toFixed(3)})`);
            g.addColorStop(1, `rgba(${EMERALD},0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, 80 * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            const fill = ctx.createLinearGradient(0, -52 * s, 0, 52 * s);
            fill.addColorStop(0, `rgba(${VIOLET},0.2)`);
            fill.addColorStop(1, `rgba(${EMERALD},0.08)`);
            ctx.fillStyle = fill;
            ctx.strokeStyle = `rgba(${LIGHT},${(0.6 + shield.flash * 0.4).toFixed(3)})`;
            ctx.lineWidth = 1.6;
            shieldPath(s);
            ctx.fill();
            ctx.stroke();

            // inner scan line, clipped to the shield
            ctx.save();
            shieldPath(s * 0.86);
            ctx.clip();
            const scanY = ((t * 26) % (120 * s)) - 60 * s;
            const sg = ctx.createLinearGradient(0, scanY - 14, 0, scanY);
            sg.addColorStop(0, `rgba(${EMERALD},0)`);
            sg.addColorStop(1, `rgba(${EMERALD},0.4)`);
            ctx.fillStyle = sg;
            ctx.fillRect(-40 * s, scanY - 14, 80 * s, 14);
            ctx.strokeStyle = `rgba(${LIGHT},0.5)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-40 * s, scanY);
            ctx.lineTo(40 * s, scanY);
            ctx.stroke();
            ctx.restore();

            // the check
            ctx.strokeStyle = `rgba(${LIGHT},0.95)`;
            ctx.lineWidth = 3 * s;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(-12 * s, 0);
            ctx.lineTo(-3 * s, 10 * s);
            ctx.lineTo(14 * s, -10 * s);
            ctx.stroke();

            ctx.restore();
        };

        /* ── attackers (deflected particles) ─────────────────────────────── */

        const stepAttacker = (dt) => {
            attackTimer -= dt;
            if (!attacker && attackTimer <= 0) {
                const side = Math.random() < 0.6 ? "top" : "right";
                const sx = side === "top" ? rand(w * 0.55, w) : w + 20;
                const sy = side === "top" ? -20 : rand(0, h * 0.5);
                const dx = shield.x - sx, dy = shield.y - sy;
                const d = Math.hypot(dx, dy) || 1;
                const v = 150;
                attacker = { x: sx, y: sy, vx: (dx / d) * v, vy: (dy / d) * v };
                attackTimer = rand(5, 8);
            }
            if (attacker) {
                attacker.x += attacker.vx * dt;
                attacker.y += attacker.vy * dt;
                const dist = Math.hypot(attacker.x - shield.x, attacker.y - shield.y);
                // streak
                ctx.save();
                ctx.globalCompositeOperation = "lighter";
                const tg = ctx.createLinearGradient(
                    attacker.x - attacker.vx * 0.16, attacker.y - attacker.vy * 0.16,
                    attacker.x, attacker.y
                );
                tg.addColorStop(0, `rgba(${VIOLET},0)`);
                tg.addColorStop(1, `rgba(${VIOLET},0.8)`);
                ctx.strokeStyle = tg;
                ctx.lineWidth = 2.2;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(attacker.x - attacker.vx * 0.16, attacker.y - attacker.vy * 0.16);
                ctx.lineTo(attacker.x, attacker.y);
                ctx.stroke();
                ctx.restore();

                if (dist < 66 * shield.s) { // deflected!
                    bursts.push({ x: attacker.x, y: attacker.y, age: 0 });
                    shield.flash = 1;
                    attacker = null;
                }
            }
            for (let i = bursts.length - 1; i >= 0; i--) {
                const b = bursts[i];
                b.age += dt;
                const f = b.age / 0.5;
                if (f >= 1) { bursts.splice(i, 1); continue; }
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.globalCompositeOperation = "lighter";
                ctx.strokeStyle = `rgba(${LIGHT},${(0.85 * (1 - f)).toFixed(3)})`;
                ctx.lineWidth = 1.6;
                ctx.lineCap = "round";
                for (let k = 0; k < 6; k++) {
                    const a = (k / 6) * Math.PI * 2 + 0.4;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a) * 4 * (1 + f * 2), Math.sin(a) * 4 * (1 + f * 2));
                    ctx.lineTo(Math.cos(a) * (10 + f * 14), Math.sin(a) * (10 + f * 14));
                    ctx.stroke();
                }
                ctx.restore();
            }
        };

        /* ── frame loop ──────────────────────────────────────────────────── */

        const frame = (now) => {
            const t = now / 1000;
            const dt = Math.min(0.05, Math.max(0.001, t - (lastT || t)));
            lastT = t;

            ctx.clearRect(0, 0, w, h);
            drawRadar(t, dt);
            drawShield(t, dt);
            stepAttacker(dt);

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
            spawnBlip();
            spawnBlip();
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
                // faint diamond mesh — the "security fabric" texture
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(139,92,246,0.04) 0px, rgba(139,92,246,0.04) 1px, transparent 1px, transparent 58px), repeating-linear-gradient(-45deg, rgba(139,92,246,0.04) 0px, rgba(139,92,246,0.04) 1px, transparent 1px, transparent 58px)",
                    maskImage: "radial-gradient(ellipse at 50% 50%, #000 24%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 24%, transparent 80%)",
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
                    background: "radial-gradient(circle at center, rgba(139,92,246,0.30) 0%, rgba(139,92,246,0) 70%)",
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
                    background: "radial-gradient(circle at center, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0) 70%)",
                    filter: "blur(30px)",
                }}
            />
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
