import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Centerpiece of the homepage capability grid: the AppLighters rocket in its
// service bay, being upgraded by a crew of robot workers — the whole site
// pitch ("we boost the app you already have") as one scene. A welder bot
// showers sparks against the hull, a courier bot ferries glowing upgrade
// modules into an open service hatch (each install sends a light pulse up the
// hull and flickers the porthole app-grid), a mechanic bot perched on the
// gantry ratchets a bolt on the nose collar, and a scanner drone orbits the
// rocket sweeping the plating. Every ~9s the engine test-fires.
//
// Pure <canvas> + rAF like the service heroes: time-based motion, paused when
// off-screen, a single posed frame under prefers-reduced-motion, dpr <= 2.
// Decorative and click-through — it sits in the empty middle cells of the grid.

const CYC = 7.5; // courier install loop (s)
const WELD = 1.7; // welder duty cycle (s)
const ENGINE = 9.5; // seconds between engine test-fires

export default function RocketWorksScene({ sx }) {
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
        let w = 0, h = 0, raf = 0, running = true, last = 0;

        // scene state that persists across frames
        const sparks = []; // welder particles
        let nutAng = 0, lastSnap = -1; // mechanic's ratcheted bolt
        let pulseT = -9; // when the last module install fired the hull pulse
        let prevPh = 0;

        const ease = (f) => (f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2);
        const clamp01 = (v) => Math.max(0, Math.min(1, v));
        const rr = (x, y, rw, rh, r) => {
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, rw, rh, r);
            else ctx.rect(x, y, rw, rh);
        };

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

        /* one robot body; arms are drawn separately so they can reach targets */
        const robot = (x, y, s, o = {}) => {
            const { tilt = 0, eye = "#7CF3D0", look = 0, thrust = true, legs = false, bob = 0, t } = o;
            const yy = y + bob;
            ctx.save();
            ctx.translate(x, yy);
            ctx.rotate(tilt);
            if (thrust) {
                const f = 0.65 + 0.35 * Math.sin(t * 21 + x * 3.1);
                const L = s * (0.45 + 0.28 * f);
                ctx.save();
                ctx.globalCompositeOperation = "lighter";
                const g = ctx.createLinearGradient(0, s * 0.5, 0, s * 0.5 + L);
                g.addColorStop(0, "rgba(235,194,255,0.8)");
                g.addColorStop(1, "rgba(190,8,255,0)");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.moveTo(-s * 0.14, s * 0.5);
                ctx.lineTo(s * 0.14, s * 0.5);
                ctx.lineTo(0, s * 0.5 + L);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            if (legs) {
                ctx.strokeStyle = "#6E5C90";
                ctx.lineWidth = s * 0.11;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(-s * 0.2, s * 0.42); ctx.lineTo(-s * 0.28, s * 0.8);
                ctx.moveTo(s * 0.2, s * 0.42); ctx.lineTo(s * 0.28, s * 0.8);
                ctx.stroke();
            }
            const bg = ctx.createLinearGradient(-s * 0.45, 0, s * 0.45, 0);
            bg.addColorStop(0, "#DACEEE");
            bg.addColorStop(0.55, "#BBA9D8");
            bg.addColorStop(1, "#8F7BB4");
            rr(-s * 0.44, -s * 0.52, s * 0.88, s * 1.02, s * 0.34);
            ctx.fillStyle = bg;
            ctx.fill();
            ctx.strokeStyle = "rgba(28,15,46,0.55)";
            ctx.lineWidth = 1;
            ctx.stroke();
            rr(-s * 0.26, s * 0.04, s * 0.52, s * 0.32, s * 0.12); // belly plate
            ctx.fillStyle = "rgba(255,255,255,0.16)";
            ctx.fill();
            rr(-s * 0.3, -s * 0.36, s * 0.6, s * 0.3, s * 0.12); // visor
            ctx.fillStyle = "#170E20";
            ctx.fill();
            const exx = look * s * 0.12;
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            const eg = ctx.createRadialGradient(exx, -s * 0.21, 0, exx, -s * 0.21, s * 0.17);
            eg.addColorStop(0, eye);
            eg.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = eg;
            ctx.beginPath(); ctx.arc(exx, -s * 0.21, s * 0.17, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            ctx.fillStyle = eye;
            ctx.beginPath(); ctx.arc(exx, -s * 0.21, s * 0.06, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#8F7BB4"; // antenna
            ctx.lineWidth = s * 0.07;
            ctx.beginPath(); ctx.moveTo(0, -s * 0.52); ctx.lineTo(0, -s * 0.72); ctx.stroke();
            const blink = (Math.sin(t * 3.4 + x) + 1) / 2;
            ctx.fillStyle = `rgba(255,150,220,${(0.3 + 0.65 * blink).toFixed(3)})`;
            ctx.beginPath(); ctx.arc(0, -s * 0.76, s * 0.06, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            return { shL: [x - s * 0.44, yy - s * 0.04], shR: [x + s * 0.44, yy - s * 0.04] };
        };

        const arm = (S, T, s, elbowUp = -1) => {
            const mx = (S[0] + T[0]) / 2, my = (S[1] + T[1]) / 2;
            const dx = T[0] - S[0], dy = T[1] - S[1];
            const len = Math.hypot(dx, dy) || 1;
            const ex = mx + (-dy / len) * s * 0.3 * elbowUp;
            const ey = my + (dx / len) * s * 0.3 * elbowUp;
            ctx.strokeStyle = "#7E6A9C";
            ctx.lineWidth = s * 0.15;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(S[0], S[1]);
            ctx.lineTo(ex, ey);
            ctx.lineTo(T[0], T[1]);
            ctx.stroke();
            ctx.fillStyle = "#B4A4D4";
            for (const [jx, jy] of [S, [ex, ey]]) {
                ctx.beginPath(); ctx.arc(jx, jy, s * 0.09, 0, Math.PI * 2); ctx.fill();
            }
        };

        const frame = (now) => {
            const t = now / 1000;
            const dt = Math.min(Math.max(t - last, 0.001), 0.05);
            last = t;
            ctx.clearRect(0, 0, w, h);

            /* ── geometry, all derived from the box size ── */
            const RH = Math.min(h * 0.8, w * 0.68);
            const RW = RH * 0.3;
            const rx = w / 2 + RW * 0.3;
            const noseTop = h * 0.52 - RH * 0.55;
            const bodyTop = noseTop + RH * 0.24;
            const bodyBot = bodyTop + RH * 0.5;
            const nozzleBot = bodyBot + RH * 0.1;
            const padY = nozzleBot + RH * 0.045;
            const portY = bodyTop + RH * 0.15;
            const hatch = { x: rx + RW * 0.06, y: bodyBot - RH * 0.155, w: RW * 0.34, h: RH * 0.075 };
            const weldP = [rx - RW * 0.5, bodyTop + RH * 0.31];
            const s = RH * 0.115; // robot size
            const gx = rx - RW * 1.75; // gantry mast
            const bridgeY = noseTop + RH * 0.225;

            const rocketPath = () => {
                const p = new Path2D();
                p.moveTo(rx - RW * 0.5, bodyBot);
                p.lineTo(rx - RW * 0.5, bodyTop);
                p.bezierCurveTo(rx - RW * 0.46, noseTop + RH * 0.09, rx - RW * 0.3, noseTop + RH * 0.012, rx, noseTop);
                p.bezierCurveTo(rx + RW * 0.3, noseTop + RH * 0.012, rx + RW * 0.46, noseTop + RH * 0.09, rx + RW * 0.5, bodyTop);
                p.lineTo(rx + RW * 0.5, bodyBot);
                p.closePath();
                return p;
            };

            /* ── backdrop: glow + blueprint grid + drifting motes ── */
            const bgGlow = ctx.createRadialGradient(rx, h * 0.5, 0, rx, h * 0.5, RH * 0.85);
            bgGlow.addColorStop(0, "rgba(178,79,224,0.12)");
            bgGlow.addColorStop(1, "rgba(178,79,224,0)");
            ctx.fillStyle = bgGlow;
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = "rgba(193,91,238,0.05)";
            ctx.lineWidth = 1;
            const step = Math.max(40, RH * 0.16);
            for (let gxx = (rx % step); gxx < w; gxx += step) { ctx.beginPath(); ctx.moveTo(gxx, 0); ctx.lineTo(gxx, h); ctx.stroke(); }
            for (let gy = (h / 2) % step; gy < h; gy += step) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            for (let i = 0; i < 9; i++) {
                const mx = ((i * 0.618 + 0.13) % 1) * w;
                const my = ((0.92 - ((t * 0.014 + i * 0.11) % 1)) * h);
                ctx.fillStyle = `rgba(216,180,250,${(0.1 + 0.12 * Math.sin(i * 2.4)).toFixed(3)})`;
                ctx.beginPath(); ctx.arc(mx, my, 1.3, 0, Math.PI * 2); ctx.fill();
            }

            /* ── scanner drone (behind the rocket half of its orbit) ── */
            const da = t * 0.5;
            const depth = Math.sin(da);
            const dX = rx + Math.cos(da) * RW * 2.15;
            const dY = bodyTop + RH * 0.2 + depth * RH * 0.09;
            const drone = () => {
                const ds = s * (0.62 + 0.14 * (depth + 1) / 2);
                ctx.save();
                ctx.globalAlpha = depth < 0 ? 0.5 : 1;
                robot(dX, dY, ds, { t, eye: "#9AD1FF", thrust: true, look: Math.cos(da) > 0 ? -1 : 1, tilt: Math.cos(da) * -0.08 });
                // scan beam toward the hull while crossing in front
                if (depth > 0.3 && Math.abs(Math.cos(da)) > 0.2) {
                    const edge = Math.cos(da) > 0 ? rx + RW * 0.5 : rx - RW * 0.5;
                    const by = Math.max(bodyTop + 6, Math.min(bodyBot - 6, dY));
                    ctx.globalCompositeOperation = "lighter";
                    const bg2 = ctx.createLinearGradient(dX, dY, edge, by);
                    bg2.addColorStop(0, "rgba(154,209,255,0.22)");
                    bg2.addColorStop(1, "rgba(154,209,255,0.02)");
                    ctx.fillStyle = bg2;
                    ctx.beginPath();
                    ctx.moveTo(dX, dY);
                    ctx.lineTo(edge, by - RH * 0.05);
                    ctx.lineTo(edge, by + RH * 0.05);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = "rgba(190,230,255,0.6)";
                    ctx.lineWidth = 1.4;
                    ctx.beginPath(); ctx.moveTo(edge, by - RH * 0.05); ctx.lineTo(edge, by + RH * 0.05); ctx.stroke();
                }
                ctx.restore();
            };
            if (depth < 0) drone();

            /* ── gantry ── */
            ctx.strokeStyle = "rgba(200,170,235,0.3)";
            ctx.lineWidth = 1.2;
            const gTop = noseTop + RH * 0.1;
            for (const off of [-RW * 0.09, RW * 0.09]) {
                ctx.beginPath(); ctx.moveTo(gx + off, padY); ctx.lineTo(gx + off, gTop); ctx.stroke();
            }
            for (let y = gTop, k = 0; y < padY - RH * 0.05; y += RH * 0.085, k++) {
                ctx.beginPath();
                ctx.moveTo(gx - RW * 0.09, y);
                ctx.lineTo(gx + RW * 0.09, y + RH * 0.085 * (k % 2 ? 1 : 0.5));
                ctx.stroke();
            }
            // service bridges (mechanic's perch + a lower stub)
            for (const [by, bx2] of [[bridgeY, rx - RW * 0.58], [bodyBot - RH * 0.05, rx - RW * 0.92]]) {
                ctx.strokeStyle = "rgba(200,170,235,0.4)";
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(gx - RW * 0.09, by); ctx.lineTo(bx2, by); ctx.stroke();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "rgba(200,170,235,0.24)";
                ctx.beginPath(); ctx.moveTo(gx, by); ctx.lineTo(bx2, by - RH * 0.03); ctx.stroke();
            }
            const beacon = (Math.sin(t * 2.6) + 1) / 2;
            ctx.fillStyle = `rgba(255,110,160,${(0.25 + 0.65 * beacon).toFixed(3)})`;
            ctx.beginPath(); ctx.arc(gx, gTop - 5, 2.6, 0, Math.PI * 2); ctx.fill();

            /* ── pad, shadow, hold-down clamps ── */
            ctx.fillStyle = "rgba(0,0,0,0.35)";
            ctx.beginPath(); ctx.ellipse(rx, padY + 3, RW * 0.85, RH * 0.02, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "rgba(215,190,245,0.12)";
            rr(rx - RW * 0.8, padY - 2, RW * 1.6, 4, 2); ctx.fill();

            /* ── rocket ── */
            // fins + nozzle first (they sit behind the hull)
            const deep = ctx.createLinearGradient(rx - RW, bodyBot, rx + RW, nozzleBot);
            deep.addColorStop(0, "#9B47E0");
            deep.addColorStop(1, "#4A128C");
            ctx.fillStyle = deep;
            ctx.beginPath();
            ctx.moveTo(rx - RW * 0.5, bodyBot - RH * 0.1);
            ctx.lineTo(rx - RW * 0.88, nozzleBot + RH * 0.015);
            ctx.lineTo(rx - RW * 0.5, bodyBot + RH * 0.02);
            ctx.closePath(); ctx.fill();
            ctx.beginPath();
            ctx.moveTo(rx + RW * 0.5, bodyBot - RH * 0.1);
            ctx.lineTo(rx + RW * 0.88, nozzleBot + RH * 0.015);
            ctx.lineTo(rx + RW * 0.5, bodyBot + RH * 0.02);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#3A0F70";
            ctx.beginPath();
            ctx.moveTo(rx - RW * 0.2, bodyBot);
            ctx.lineTo(rx + RW * 0.2, bodyBot);
            ctx.lineTo(rx + RW * 0.28, nozzleBot);
            ctx.lineTo(rx - RW * 0.28, nozzleBot);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#241148";
            ctx.beginPath(); ctx.ellipse(rx, nozzleBot, RW * 0.28, RW * 0.07, 0, 0, Math.PI * 2); ctx.fill();

            // engine test-fire
            const eph = t % ENGINE;
            if (eph < 1.6 && !reduce) {
                const env = Math.sin(Math.PI * (eph / 1.6));
                ctx.save();
                ctx.globalCompositeOperation = "lighter";
                for (let i = 0; i < 3; i++) {
                    const fl = 0.7 + 0.3 * Math.sin(t * 27 + i * 2.4);
                    const L = RH * (0.3 - i * 0.08) * env * fl;
                    const W2 = RW * (0.3 - i * 0.08);
                    const fg = ctx.createLinearGradient(0, nozzleBot, 0, nozzleBot + L);
                    fg.addColorStop(0, ["rgba(253,244,255,0.95)", "rgba(235,194,255,0.8)", "rgba(255,255,255,0.9)"][i]);
                    fg.addColorStop(0.6, "rgba(193,91,243,0.55)");
                    fg.addColorStop(1, "rgba(124,27,206,0)");
                    ctx.fillStyle = fg;
                    ctx.beginPath();
                    ctx.moveTo(rx - W2, nozzleBot);
                    ctx.quadraticCurveTo(rx - W2 * 0.5, nozzleBot + L * 0.6, rx, nozzleBot + L);
                    ctx.quadraticCurveTo(rx + W2 * 0.5, nozzleBot + L * 0.6, rx + W2, nozzleBot);
                    ctx.closePath();
                    ctx.fill();
                }
                const gg = ctx.createRadialGradient(rx, nozzleBot, 0, rx, nozzleBot, RW * 1.2 * env);
                gg.addColorStop(0, "rgba(216,140,255,0.5)");
                gg.addColorStop(1, "rgba(216,140,255,0)");
                ctx.fillStyle = gg;
                ctx.beginPath(); ctx.arc(rx, nozzleBot, RW * 1.2 * env, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                // smoke puffs rolling off the pad
                for (let i = 0; i < 4; i++) {
                    const pu = clamp01(eph / 1.6 - i * 0.12);
                    if (pu <= 0) continue;
                    const dir = i % 2 ? 1 : -1;
                    ctx.fillStyle = `rgba(190,170,215,${(0.16 * (1 - pu) * env).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.arc(rx + dir * (RW * 0.32 + pu * RW * 1.15), padY - RH * 0.01 - pu * RH * 0.05, RW * (0.12 + pu * 0.3), 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // hull
            const sil = rocketPath();
            const hull = ctx.createLinearGradient(rx - RW * 0.5, 0, rx + RW * 0.5, 0);
            hull.addColorStop(0, "#F8F1FF");
            hull.addColorStop(0.5, "#EBDDFA");
            hull.addColorStop(1, "#C2A5E2");
            ctx.fillStyle = hull;
            ctx.fill(sil);
            // right-side ambient shade
            ctx.save();
            ctx.clip(sil);
            const shade = ctx.createLinearGradient(rx + RW * 0.1, 0, rx + RW * 0.5, 0);
            shade.addColorStop(0, "rgba(60,20,100,0)");
            shade.addColorStop(1, "rgba(60,20,100,0.24)");
            ctx.fillStyle = shade;
            ctx.fillRect(rx, noseTop, RW, bodyBot - noseTop);
            // panel seams
            ctx.strokeStyle = "rgba(90,40,120,0.16)";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(rx - RW * 0.5, bodyTop + RH * 0.26); ctx.lineTo(rx + RW * 0.5, bodyTop + RH * 0.26); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rx, bodyTop + RH * 0.28); ctx.lineTo(rx, bodyBot); ctx.stroke();
            ctx.restore();
            // nose cone
            const noseG = ctx.createLinearGradient(rx - RW * 0.4, noseTop, rx + RW * 0.4, bodyTop);
            noseG.addColorStop(0, "#D7A6FF");
            noseG.addColorStop(1, "#7E2BD8");
            ctx.fillStyle = noseG;
            ctx.beginPath();
            ctx.moveTo(rx - RW * 0.5, bodyTop);
            ctx.bezierCurveTo(rx - RW * 0.46, noseTop + RH * 0.09, rx - RW * 0.3, noseTop + RH * 0.012, rx, noseTop);
            ctx.bezierCurveTo(rx + RW * 0.3, noseTop + RH * 0.012, rx + RW * 0.46, noseTop + RH * 0.09, rx + RW * 0.5, bodyTop);
            ctx.closePath();
            ctx.fill();
            // collar band (the mechanic's bolt lives here)
            ctx.fillStyle = "#E7D6F8";
            ctx.fillRect(rx - RW * 0.5, bodyTop, RW, RH * 0.028);
            ctx.strokeStyle = "rgba(28,15,46,0.35)";
            ctx.lineWidth = 1;
            ctx.stroke(sil);

            // porthole with the brand app-grid inside
            ctx.fillStyle = "#7E2BD8";
            ctx.beginPath(); ctx.arc(rx, portY, RW * 0.235, 0, Math.PI * 2); ctx.fill();
            const port = ctx.createRadialGradient(rx, portY, 0, rx, portY, RW * 0.2);
            port.addColorStop(0, "#341B4E");
            port.addColorStop(1, "#1D0F30");
            ctx.fillStyle = port;
            ctx.beginPath(); ctx.arc(rx, portY, RW * 0.19, 0, Math.PI * 2); ctx.fill();
            const sincePulse = t - pulseT;
            for (let i = 0; i < 4; i++) {
                const cxc = rx + (i % 2 ? RW * 0.055 : -RW * 0.055) - RW * 0.045 + (i % 2 ? 0 : 0);
                const gx2 = rx + ((i % 2) * 2 - 1) * RW * 0.06 - RW * 0.045;
                const gy2 = portY + (i < 2 ? -1 : 1) * RW * 0.06 - RW * 0.045;
                const flash = sincePulse < 1.2 ? 0.45 * Math.max(0, Math.sin(Math.PI * clamp01(sincePulse - i * 0.12))) : 0;
                ctx.fillStyle = `rgba(201,139,255,${(0.75 + flash).toFixed(3)})`;
                rr(gx2, gy2, RW * 0.09, RW * 0.09, RW * 0.025);
                ctx.fill();
            }

            // open service hatch + swung door + light spill
            ctx.fillStyle = "#180D24";
            rr(hatch.x, hatch.y, hatch.w, hatch.h, 3);
            ctx.fill();
            const spill = ctx.createLinearGradient(hatch.x, 0, hatch.x + hatch.w * 1.7, 0);
            spill.addColorStop(0, "rgba(193,91,238,0.4)");
            spill.addColorStop(1, "rgba(193,91,238,0)");
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = spill;
            ctx.beginPath();
            ctx.moveTo(hatch.x + hatch.w, hatch.y);
            ctx.lineTo(hatch.x + hatch.w * 2.1, hatch.y - hatch.h * 0.7);
            ctx.lineTo(hatch.x + hatch.w * 2.1, hatch.y + hatch.h * 1.7);
            ctx.lineTo(hatch.x + hatch.w, hatch.y + hatch.h);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            ctx.save(); // door hinged on the hatch's right edge
            ctx.translate(hatch.x + hatch.w, hatch.y);
            ctx.rotate(0.9);
            ctx.fillStyle = "#D9C6F2";
            rr(0, 0, hatch.w * 0.9, 3, 1.5);
            ctx.fill();
            ctx.restore();

            // upgrade pulse racing up the hull after each install
            if (sincePulse < 1) {
                const u = ease(sincePulse);
                const py2 = hatch.y - (hatch.y - noseTop - RH * 0.03) * u;
                ctx.save();
                ctx.clip(sil);
                ctx.globalCompositeOperation = "lighter";
                const band = ctx.createLinearGradient(0, py2 + RH * 0.045, 0, py2 - RH * 0.045);
                band.addColorStop(0, "rgba(193,91,238,0)");
                band.addColorStop(0.5, `rgba(216,150,255,${(0.5 * (1 - u)).toFixed(3)})`);
                band.addColorStop(1, "rgba(193,91,238,0)");
                ctx.fillStyle = band;
                ctx.fillRect(rx - RW * 0.5, py2 - RH * 0.045, RW, RH * 0.09);
                ctx.restore();
            }

            /* ── crew ── */
            // mechanic on the bridge, ratcheting a bolt on the collar band
            const bolt = [rx - RW * 0.38, bodyTop + RH * 0.014];
            const rph = (t * 0.7) % 1;
            if (rph < 0.02 && lastSnap !== Math.floor(t * 0.7)) { lastSnap = Math.floor(t * 0.7); nutAng += Math.PI / 6; }
            const wAng = rph < 0.72 ? -0.55 + 0.75 * (rph / 0.72) : 0.2 - 0.75 * ((rph - 0.72) / 0.28);
            const mech = robot(rx - RW * 0.78, bridgeY - s * 0.78, s, { t, eye: "#FF9AD5", thrust: false, legs: true, look: 1 });
            arm(mech.shR, [bolt[0] - Math.sin(wAng) * s * 0.5, bolt[1] - Math.cos(wAng) * s * 0.5], s, -1);
            ctx.save(); // the wrench itself
            ctx.translate(bolt[0], bolt[1]);
            ctx.rotate(wAng);
            ctx.strokeStyle = "#C9B8E6";
            ctx.lineWidth = s * 0.13;
            ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(0, -s * 0.16); ctx.lineTo(0, -s * 0.62); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, s * 0.16, 0.6, Math.PI * 2 - 0.6); ctx.stroke();
            ctx.restore();
            ctx.save(); // the bolt turning in steps
            ctx.translate(bolt[0], bolt[1]);
            ctx.rotate(nutAng);
            ctx.fillStyle = "#8F5BC8";
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const a2 = (i / 6) * Math.PI * 2;
                ctx[i ? "lineTo" : "moveTo"](Math.cos(a2) * s * 0.11, Math.sin(a2) * s * 0.11);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // welder against the hull
            const weldOn = (t % WELD) < 0.95 || reduce;
            const wBob = Math.sin(t * 2.1) * s * 0.12;
            const weld = robot(rx - RW * 1.05, bodyTop + RH * 0.31 + wBob, s, { t, eye: "#FFD98A", look: 1, bob: 0 });
            arm(weld.shR, [weldP[0] - s * 0.1, weldP[1] + wBob * 0.4], s, -1);
            if (weldOn && !reduce) {
                // hot point + hull glow + sparks
                ctx.save();
                ctx.globalCompositeOperation = "lighter";
                const hot = ctx.createRadialGradient(weldP[0], weldP[1], 0, weldP[0], weldP[1], s * 0.55);
                hot.addColorStop(0, "rgba(255,255,255,0.95)");
                hot.addColorStop(0.3, "rgba(255,222,160,0.7)");
                hot.addColorStop(1, "rgba(255,180,90,0)");
                ctx.fillStyle = hot;
                ctx.beginPath(); ctx.arc(weldP[0], weldP[1], s * 0.55, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                ctx.save();
                ctx.clip(sil);
                ctx.globalCompositeOperation = "lighter";
                const lit = ctx.createRadialGradient(weldP[0], weldP[1], 0, weldP[0], weldP[1], RW * 0.7);
                lit.addColorStop(0, "rgba(255,214,150,0.28)");
                lit.addColorStop(1, "rgba(255,214,150,0)");
                ctx.fillStyle = lit;
                ctx.beginPath(); ctx.arc(weldP[0], weldP[1], RW * 0.7, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
                if (sparks.length < 16 && Math.random() < 0.7) {
                    const a3 = Math.PI * 0.25 + Math.random() * Math.PI * 0.9; // down-left fan
                    sparks.push({ x: weldP[0], y: weldP[1], vx: Math.cos(a3) * -RH * (0.2 + Math.random() * 0.5), vy: Math.sin(a3) * RH * (0.25 + Math.random() * 0.45), life: 1 });
                }
            }
            for (let i = sparks.length - 1; i >= 0; i--) {
                const p = sparks[i];
                p.life -= dt * 1.8;
                if (p.life <= 0) { sparks.splice(i, 1); continue; }
                p.vy += RH * 0.9 * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                ctx.save();
                ctx.globalCompositeOperation = "lighter";
                ctx.strokeStyle = `rgba(255,${p.life > 0.5 ? 236 : 190},${p.life > 0.5 ? 190 : 120},${p.life.toFixed(3)})`;
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03);
                ctx.stroke();
                ctx.restore();
            }

            // courier ferrying upgrade modules into the hatch
            const dock = [hatch.x + hatch.w + s * 0.85, hatch.y + hatch.h * 0.4];
            const home = [Math.min(w - s, rx + RW * 2.05), hatch.y - RH * 0.1];
            const ph = t % CYC;
            if (prevPh > ph) prevPh = 0; // wrapped
            let cx2, cy2, carrying = false, tiltC = 0;
            if (ph < 2.4) {
                const u = ease(ph / 2.4);
                cx2 = home[0] + (dock[0] - home[0]) * u;
                cy2 = home[1] + (dock[1] - home[1]) * u + Math.sin(u * Math.PI) * -RH * 0.06;
                carrying = true;
                tiltC = -0.1 * (1 - u);
            } else if (ph < 3.4) {
                cx2 = dock[0]; cy2 = dock[1];
                carrying = false; // module is sliding in
                if (prevPh < 2.4) pulseT = t + 0.55; // fire the hull pulse as it seats
            } else if (ph < 4.6) {
                cx2 = dock[0]; cy2 = dock[1] + Math.sin(t * 2.4) * s * 0.1;
            } else if (ph < 7) {
                const u = ease((ph - 4.6) / 2.4);
                cx2 = dock[0] + (home[0] - dock[0]) * u;
                cy2 = dock[1] + (home[1] - dock[1]) * u + Math.sin(u * Math.PI) * -RH * 0.05;
                tiltC = 0.1 * (1 - Math.abs(u - 0.5) * 2);
            } else {
                cx2 = home[0]; cy2 = home[1] + Math.sin(t * 2.2) * s * 0.12;
            }
            prevPh = ph;
            const cour = robot(cx2, cy2, s, { t, eye: "#7CF3D0", look: -1, tilt: tiltC });
            const modW = s * 0.52;
            if (carrying || (ph >= 7 || ph < 2.4)) {
                if (carrying) {
                    // module held under the body
                    arm(cour.shL, [cx2 - modW * 0.45, cy2 + s * 0.75], s, 1);
                    arm(cour.shR, [cx2 + modW * 0.45, cy2 + s * 0.75], s, -1);
                    ctx.save();
                    ctx.translate(cx2, cy2 + s * 0.85);
                    ctx.fillStyle = "#2A1840";
                    rr(-modW / 2, -modW / 2, modW, modW, modW * 0.2);
                    ctx.fill();
                    ctx.strokeStyle = "rgba(193,91,238,0.9)";
                    ctx.lineWidth = 1.4;
                    ctx.stroke();
                    ctx.save();
                    ctx.globalCompositeOperation = "lighter";
                    const mg = ctx.createRadialGradient(0, 0, 0, 0, 0, modW);
                    mg.addColorStop(0, "rgba(216,150,255,0.5)");
                    mg.addColorStop(1, "rgba(216,150,255,0)");
                    ctx.fillStyle = mg;
                    ctx.beginPath(); ctx.arc(0, 0, modW, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                    ctx.fillStyle = "#C98BFF";
                    ctx.beginPath(); ctx.arc(0, 0, modW * 0.16, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                }
            } else if (ph < 3.4) {
                // module easing from the courier into the hatch
                const mu = ease(clamp01((ph - 2.4) / 0.8));
                const mx2 = dock[0] - s * 0.2 + (hatch.x + hatch.w * 0.45 - dock[0]) * mu;
                const my2 = dock[1] + s * 0.85 + (hatch.y + hatch.h * 0.5 - dock[1] - s * 0.85) * mu;
                const sc = 1 - 0.35 * mu;
                arm(cour.shL, [mx2, my2 - modW * 0.6 * sc], s, 1);
                ctx.save();
                ctx.translate(mx2, my2);
                ctx.scale(sc, sc);
                ctx.globalAlpha = 1 - mu * 0.35;
                ctx.fillStyle = "#2A1840";
                rr(-modW / 2, -modW / 2, modW, modW, modW * 0.2);
                ctx.fill();
                ctx.strokeStyle = "rgba(193,91,238,0.9)";
                ctx.lineWidth = 1.4;
                ctx.stroke();
                ctx.fillStyle = "#C98BFF";
                ctx.beginPath(); ctx.arc(0, 0, modW * 0.16, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }

            if (depth >= 0) drone();

            if (running && !reduce) raf = requestAnimationFrame(frame);
        };

        const start = () => { if (raf) cancelAnimationFrame(raf); last = performance.now() / 1000; raf = requestAnimationFrame(frame); };

        resize();
        if (reduce) frame(2000);
        else start();

        let io;
        if (!reduce && typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver((es) => es.forEach((en) => {
                running = en.isIntersecting;
                if (running) start(); else if (raf) cancelAnimationFrame(raf);
            }));
            io.observe(wrap);
        }
        let rt;
        const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduce) frame(2000); }, 150); };
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            clearTimeout(rt);
            if (io) io.disconnect();
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <Box ref={wrapRef} aria-hidden="true" sx={{ position: "relative", pointerEvents: "none", ...sx }}>
            <Box component="canvas" ref={canvasRef} sx={{ position: "absolute", inset: 0 }} />
        </Box>
    );
}
