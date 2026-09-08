import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// The homepage signature visual: a realistic, ethereal purple EYE — a "third
// eye / all-seeing" motif — that follows the cursor, wrapped in radiating light,
// counter-rotating rings and rising sparks. Replaces the old blinding white core
// (which washed out the headline): the eye's centre is a dark pupil, so text
// over it stays readable.
//
// Mouse tracking is client-only (useEffect); SSR renders the eye centred, so no
// hydration mismatch. Blink + ambient loops pause under prefers-reduced-motion
// (see styles/_bgAnim.scss); cursor tracking is direct manipulation, left on.

const SPARKS = [
    { left: "50%", delay: "0s", dur: "5.5s", size: 5 },
    { left: "38%", delay: "1.2s", dur: "6.5s", size: 4 },
    { left: "62%", delay: "0.6s", dur: "7s", size: 4 },
    { left: "30%", delay: "2.4s", dur: "6s", size: 3 },
    { left: "70%", delay: "1.8s", dur: "7.5s", size: 4 },
    { left: "46%", delay: "3s", dur: "6.2s", size: 4 },
    { left: "56%", delay: "2.1s", dur: "8s", size: 3 },
];

// Pupil travel inside the eye, in SVG viewBox units (viewBox is 0 0 200 120).
const MAX_X = 30;
const MAX_Y = 15;

// Iris geometry + generated fibers for a realistic texture.
const CX = 100, CY = 60;
// Rounded to 3dp on purpose: Math.cos/sin can differ by one ULP between the
// server's Node and the browser's V8, and the raw values land in SVG attributes
// — that last digit was enough to trigger a React hydration mismatch warning.
const r3 = (n) => Math.round(n * 1000) / 1000;
const polar = (r, deg) => {
    const a = (deg * Math.PI) / 180;
    return [r3(CX + r * Math.cos(a)), r3(CY + r * Math.sin(a))];
};
const FIBERS = Array.from({ length: 76 }, (_, i) => {
    const a = i * (360 / 76);
    const rIn = 17 + ((i * 7) % 4);
    const rOut = 38 - ((i * 3) % 5);
    const [x1, y1] = polar(rIn, a);
    const [x2, y2] = polar(rOut, a);
    const light = i % 2 === 0;
    const o = (light ? 0.1 : 0.14) + (i % 3) * 0.03;
    return { x1, y1, x2, y2, stroke: light ? `rgba(233,204,255,${o})` : `rgba(48,16,94,${o})` };
});

export default function HeroAura() {
    const wrapRef = useRef(null);
    const irisRef = useRef(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const iris = irisRef.current;
        if (!wrap || !iris || typeof window === "undefined") return;

        // When the cursor goes still (or leaves the page/tab), the eye stops
        // tracking it and instead watches the app chain drifting along the
        // bottom of the hero: it looks down and pans right-to-left with the
        // apps, then flicks back to catch the next one — like reading a queue.
        const IDLE_MS = 1500;
        const SWEEP_S = 3.4; // seconds per pass
        const FLICK = 0.16; // last slice of the pass = the flick back

        let raf = 0, running = true;
        let curX = 0, curY = 0;
        let mouseX = 0, mouseY = 0, hasMouse = false;
        let lastMoveAt = -1e9; // start out watching the apps
        let inside = true;

        const mouseTarget = () => {
            const r = wrap.getBoundingClientRect();
            if (!r.width) return [0, 0];
            const dx = mouseX - (r.left + r.width / 2);
            const dy = mouseY - (r.top + r.height / 2);
            const dist = Math.hypot(dx, dy) || 1;
            const reach = Math.min(1, dist / (r.width * 0.55));
            return [(dx / dist) * MAX_X * reach, (dy / dist) * MAX_Y * reach];
        };

        const watchTarget = (now) => {
            const p = ((now / 1000) % SWEEP_S) / SWEEP_S; // 0..1
            // pan +1 -> -1 across most of the cycle, then snap back over FLICK
            const s = p < 1 - FLICK ? 1 - (p / (1 - FLICK)) * 2 : -1 + ((p - (1 - FLICK)) / FLICK) * 2;
            return [s * MAX_X * 0.85, MAX_Y * 0.8];
        };

        const frame = (now) => {
            const idle = !hasMouse || !inside || document.hidden || now - lastMoveAt > IDLE_MS;
            const [tgtX, tgtY] = idle ? watchTarget(now) : mouseTarget();
            curX += (tgtX - curX) * 0.12;
            curY += (tgtY - curY) * 0.12;
            iris.setAttribute("transform", `translate(${curX.toFixed(2)} ${curY.toFixed(2)})`);
            if (running) raf = requestAnimationFrame(frame);
        };

        const start = () => { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };

        const onMove = (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            hasMouse = true; inside = true;
            lastMoveAt = performance.now();
        };
        const onLeave = () => { inside = false; };
        const onEnter = () => { inside = true; };

        window.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseleave", onLeave);
        document.addEventListener("mouseenter", onEnter);
        start();

        // don't burn frames while the hero is scrolled away
        let io;
        if (typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver((es) => es.forEach((en) => {
                running = en.isIntersecting;
                if (running) start(); else if (raf) cancelAnimationFrame(raf);
            }));
            io.observe(wrap);
        }

        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
            document.removeEventListener("mouseenter", onEnter);
            if (io) io.disconnect();
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const almond = "M 12 60 C 55 8, 145 8, 188 60 C 145 112, 55 112, 12 60 Z";

    return (
        <Box
            ref={wrapRef}
            aria-hidden="true"
            className="hero-aura"
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: 320, sm: 460, lg: 560 },
                height: { xs: 320, sm: 460, lg: 560 },
                pointerEvents: "none",
                zIndex: 0,
            }}
        >
            {/* Soft outer halo (dimmed so the headline reads over it) */}
            <Box
                sx={{
                    position: "absolute",
                    inset: "-10%",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(178,79,224,0.22) 0%, rgba(126,43,216,0.10) 42%, rgba(126,43,216,0) 70%)",
                    filter: "blur(6px)",
                    animation: "aura-pulse 6s ease-in-out infinite",
                }}
            />

            {/* Outer rotating light ring */}
            <Box
                sx={{
                    position: "absolute",
                    inset: "6%",
                    borderRadius: "50%",
                    background:
                        "conic-gradient(from 0deg, rgba(201,139,255,0) 0deg, rgba(201,139,255,0.8) 90deg, rgba(178,79,224,0) 200deg, rgba(230,190,255,0.6) 300deg, rgba(201,139,255,0) 360deg)",
                    WebkitMaskImage:
                        "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
                    maskImage:
                        "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
                    animation: "aura-spin 18s linear infinite",
                    opacity: 0.85,
                }}
            />

            {/* Inner counter-rotating ring */}
            <Box
                sx={{
                    position: "absolute",
                    inset: "20%",
                    borderRadius: "50%",
                    background:
                        "conic-gradient(from 180deg, rgba(126,43,216,0) 0deg, rgba(201,139,255,0.6) 120deg, rgba(126,43,216,0) 240deg, rgba(201,139,255,0.4) 340deg, rgba(126,43,216,0) 360deg)",
                    WebkitMaskImage:
                        "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                    maskImage:
                        "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                    animation: "aura-spin-rev 24s linear infinite",
                    opacity: 0.7,
                }}
            />

            {/* Radiating light rays behind the eye (ethereal / third-eye feel) */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "66%",
                    height: "46%",
                    transform: "translate(-50%, -50%)",
                    background:
                        "repeating-conic-gradient(from 0deg at 50% 50%, rgba(201,139,255,0.16) 0deg, rgba(201,139,255,0) 2.5deg 13deg)",
                    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, #000 10%, transparent 72%)",
                    maskImage: "radial-gradient(ellipse at 50% 50%, #000 10%, transparent 72%)",
                    animation: "aura-spin 46s linear infinite",
                    opacity: 0.55,
                }}
            />

            {/* Glow behind the eye */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "46%",
                    height: "30%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at 50% 50%, rgba(178,79,224,0.34) 0%, rgba(126,43,216,0.1) 55%, rgba(126,43,216,0) 100%)",
                    filter: "blur(10px)",
                }}
            />

            {/* The eye */}
            <Box
                component="svg"
                viewBox="0 0 200 120"
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: { xs: "62%", sm: "58%", lg: "56%" },
                    height: "auto",
                    transform: "translate(-50%, -50%)",
                    overflow: "visible",
                    opacity: 0.74, // slightly dimmed so it sits behind the copy
                }}
            >
                <defs>
                    <radialGradient id="ha-iris" cx="42%" cy="36%" r="66%">
                        <stop offset="0%" stopColor="#F6ECFF" />
                        <stop offset="20%" stopColor="#D9B8FF" />
                        <stop offset="50%" stopColor="#A566EE" />
                        <stop offset="78%" stopColor="#7E2BD8" />
                        <stop offset="100%" stopColor="#3E1180" />
                    </radialGradient>
                    <radialGradient id="ha-pupil" cx="50%" cy="46%" r="60%">
                        <stop offset="0%" stopColor="#241132" />
                        <stop offset="60%" stopColor="#0a0512" />
                        <stop offset="100%" stopColor="#030108" />
                    </radialGradient>
                    <radialGradient id="ha-sclera" cx="50%" cy="42%" r="70%">
                        <stop offset="0%" stopColor="rgba(44,26,62,0.94)" />
                        <stop offset="100%" stopColor="rgba(8,6,13,0.98)" />
                    </radialGradient>
                    <linearGradient id="ha-rim" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F1E4FF" />
                        <stop offset="100%" stopColor="#7E2BD8" />
                    </linearGradient>
                    {/* Dark-purple eyelids (not black), with a lit rim where they meet */}
                    <linearGradient id="ha-lid-top" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#160b24" />
                        <stop offset="85%" stopColor="#241338" />
                        <stop offset="100%" stopColor="#3a2154" />
                    </linearGradient>
                    <linearGradient id="ha-lid-bot" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3a2154" />
                        <stop offset="15%" stopColor="#241338" />
                        <stop offset="100%" stopColor="#160b24" />
                    </linearGradient>
                    <clipPath id="ha-eye">
                        <path d={almond} />
                    </clipPath>
                </defs>

                {/* Eye interior + iris, clipped to the almond */}
                <g clipPath="url(#ha-eye)">
                    <rect x="0" y="0" width="200" height="120" fill="url(#ha-sclera)" />
                    <g ref={irisRef}>
                        {/* iris base */}
                        <circle cx={CX} cy={CY} r="40" fill="url(#ha-iris)" />
                        {/* fiber texture */}
                        {FIBERS.map((f, i) => (
                            <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} stroke={f.stroke} strokeWidth="0.6" strokeLinecap="round" />
                        ))}
                        {/* collarette (mid-iris ring) */}
                        <circle cx={CX} cy={CY} r="24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.4" />
                        {/* depth shadow toward the pupil */}
                        <circle cx={CX} cy={CY} r="18.5" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="3" />
                        {/* limbal ring (dark outer edge) */}
                        <circle cx={CX} cy={CY} r="40" fill="none" stroke="rgba(26,8,54,0.9)" strokeWidth="2.5" />
                        {/* pupil */}
                        <circle cx={CX} cy={CY} r="16" fill="url(#ha-pupil)" />
                        <circle cx={CX} cy={CY} r="16" fill="none" stroke="rgba(201,139,255,0.35)" strokeWidth="1" />
                        {/* catchlights */}
                        <circle cx="90" cy="49" r="6" fill="rgba(255,255,255,0.95)" />
                        <circle cx="108" cy="70" r="2.4" fill="rgba(255,255,255,0.6)" />
                    </g>
                    {/* Blink lids — upper descends from the top, lower rises from
                        the bottom; they meet at the centre, then part to reopen
                        (base transform keeps them open; see _bgAnim.scss). */}
                    <rect className="eye-lid-top" x="0" y="0" width="200" height="60.5" fill="url(#ha-lid-top)" />
                    <rect className="eye-lid-bot" x="0" y="59.5" width="200" height="60.5" fill="url(#ha-lid-bot)" />
                </g>

                {/* Eyelid rim with a soft glow */}
                <path
                    d={almond}
                    fill="none"
                    stroke="url(#ha-rim)"
                    strokeWidth="2.5"
                    style={{ filter: "drop-shadow(0 0 6px rgba(201,139,255,0.55))" }}
                />
            </Box>

            {/* Rising sparks */}
            {SPARKS.map((s, i) => (
                <Box
                    key={i}
                    sx={{
                        position: "absolute",
                        bottom: "40%",
                        left: s.left,
                        width: s.size,
                        height: s.size,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, #F3E5FF 0%, #C98BFF 55%, rgba(201,139,255,0) 100%)",
                        opacity: 0,
                        animation: `spark-rise ${s.dur} ease-in ${s.delay} infinite`,
                    }}
                />
            ))}
        </Box>
    );
}
