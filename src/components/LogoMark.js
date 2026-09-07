import { useId } from "react";

// Shared exhaust-flame silhouette.
const FLAME =
    "M53 107 C 49 120, 42 126, 47 136 C 50 143, 56 148, 60 155 C 64 148, 70 143, 73 136 C 78 126, 71 120, 67 107 Z";

// Loop animation used by the footer mark: the rocket "flies" (float + gentle
// rot/wobble) while the flame burns like fire — three tongues licking at
// different rates/phases, drifting embers, and a pulsing glow. Disabled under
// prefers-reduced-motion.
const FIRE_CSS = `
.alm-fly{transform-box:fill-box;transform-origin:50% 50%;animation:alm-fly 3.4s ease-in-out infinite}
@keyframes alm-fly{0%{transform:translate(0px,2.5px) rotate(-1.4deg)}50%{transform:translate(1px,-3.5px) rotate(1.4deg)}100%{transform:translate(0px,2.5px) rotate(-1.4deg)}}
.alm-tongue{transform-box:fill-box;transform-origin:50% 0%}
.alm-t0{animation:alm-lick0 .78s ease-in-out infinite;animation-delay:-.07s}
.alm-t1{animation:alm-lick1 .52s ease-in-out infinite}
.alm-t2{animation:alm-lick2 .40s ease-in-out infinite;animation-delay:-.13s}
.alm-t3{animation:alm-lick3 .30s ease-in-out infinite;animation-delay:-.21s}
@keyframes alm-lick0{0%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.34}30%{transform:scaleY(1.2) scaleX(1.05) skewX(-4deg);opacity:.46}60%{transform:scaleY(.88) scaleX(1.1) skewX(3deg);opacity:.28}100%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.34}}
.alm-hot{transform-box:fill-box;transform-origin:50% 0%;animation:alm-hot .21s ease-in-out infinite}
@keyframes alm-hot{0%,100%{transform:scaleY(1) scaleX(1);opacity:.95}50%{transform:scaleY(1.35) scaleX(.86);opacity:.7}}
.alm-streak{transform-box:fill-box;transform-origin:50% 0%;animation:alm-streak .9s ease-in-out infinite}
@keyframes alm-streak{0%,100%{transform:scaleY(1);opacity:.18}50%{transform:scaleY(1.7);opacity:.4}}
@keyframes alm-lick1{0%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.9}22%{transform:scaleY(1.26) scaleX(.93) skewX(6deg);opacity:1}44%{transform:scaleY(.9) scaleX(1.06) skewX(-5deg);opacity:.82}66%{transform:scaleY(1.17) scaleX(.97) skewX(4deg);opacity:1}84%{transform:scaleY(.97) scaleX(1.03) skewX(-2deg);opacity:.9}100%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.9}}
@keyframes alm-lick2{0%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.9}25%{transform:scaleY(1.34) scaleX(.9) skewX(-7deg);opacity:1}50%{transform:scaleY(.85) scaleX(1.08) skewX(6deg);opacity:.8}75%{transform:scaleY(1.2) scaleX(.95) skewX(-4deg);opacity:1}100%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.9}}
@keyframes alm-lick3{0%{transform:scaleY(1.05) scaleX(1) skewX(2deg);opacity:.95}30%{transform:scaleY(1.42) scaleX(.88) skewX(8deg);opacity:1}55%{transform:scaleY(.8) scaleX(1.1) skewX(-6deg);opacity:.85}80%{transform:scaleY(1.28) scaleX(.94) skewX(5deg);opacity:1}100%{transform:scaleY(1.05) scaleX(1) skewX(2deg);opacity:.95}}
.alm-spark{transform-box:fill-box;transform-origin:center}
.alm-s1{animation:alm-spark1 1.05s ease-in infinite}
.alm-s2{animation:alm-spark2 1.35s ease-in infinite;animation-delay:-.5s}
.alm-s3{animation:alm-spark3 .9s ease-in infinite;animation-delay:-.3s}
.alm-s4{animation:alm-spark4 1.18s ease-in infinite;animation-delay:-.75s}
.alm-s5{animation:alm-spark5 .82s ease-in infinite;animation-delay:-.15s}
@keyframes alm-spark1{0%{transform:translate(0,0) scale(1);opacity:0}18%{opacity:.95}100%{transform:translate(-5px,18px) scale(.2);opacity:0}}
@keyframes alm-spark2{0%{transform:translate(0,0) scale(1);opacity:0}18%{opacity:.9}100%{transform:translate(-9px,14px) scale(.2);opacity:0}}
@keyframes alm-spark3{0%{transform:translate(0,0) scale(1);opacity:0}18%{opacity:.85}100%{transform:translate(2px,17px) scale(.2);opacity:0}}
@keyframes alm-spark4{0%{transform:translate(0,0) scale(1);opacity:0}20%{opacity:.9}100%{transform:translate(7px,20px) scale(.15);opacity:0}}
@keyframes alm-spark5{0%{transform:translate(0,0) scale(1);opacity:0}22%{opacity:1}100%{transform:translate(-2px,23px) scale(.18);opacity:0}}
.alm-glow{transform-box:fill-box;transform-origin:center;animation:alm-glowp .55s ease-in-out infinite}
@keyframes alm-glowp{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.75;transform:scale(1.18)}}
@media (prefers-reduced-motion:reduce){.alm-fly,.alm-tongue,.alm-spark,.alm-glow,.alm-hot,.alm-streak{animation:none}}
`;

/**
 * AppLighters logomark — the "App" launch rocket riding its Lighter Flame thrust,
 * tilted ~22° so the nose leans into the wordmark. Size via `height`; `glow` adds
 * the flame drop-shadow. Pass `animated` for the looping fly + fire treatment
 * (used in the footer). Gradient ids are namespaced with useId() so the mark can
 * render more than once on a page without duplicate-id collisions.
 */
export default function LogoMark({ height = 40, glow = false, animated = false, style, ...props }) {
    const uid = useId().replace(/:/g, "");
    const g = (n) => `${uid}-${n}`;

    const body = (
        <>
            {/* fins */}
            <path d="M43 82 L27 108 L43 100 Z" fill={`url(#${g("deep")})`} />
            <path d="M77 82 L93 108 L77 100 Z" fill={`url(#${g("deep")})`} />
            {/* nozzle */}
            <path d="M51 99 L69 99 L66 110 L54 110 Z" fill={`url(#${g("deep")})`} />
            {/* body */}
            <rect x="41" y="40" width="38" height="62" rx="11" fill={`url(#${g("body")})`} />
            {/* nose cone */}
            <path d="M60 8 C 69 17, 76 28, 76 44 L 44 44 C 44 28, 51 17, 60 8 Z" fill={`url(#${g("purple")})`} />
            {/* accent band */}
            <rect x="41" y="45" width="38" height="4.2" fill="#E7D6F8" />
            {/* app grid */}
            <rect x="49.5" y="61.5" width="9" height="9" rx="2.6" fill="#7E2BD8" />
            <rect x="61.5" y="61.5" width="9" height="9" rx="2.6" fill="#7E2BD8" />
            <rect x="49.5" y="73.5" width="9" height="9" rx="2.6" fill="#9B47E0" />
            <rect x="61.5" y="73.5" width="9" height="9" rx="2.6" fill="#9B47E0" />
        </>
    );

    return (
        <svg
            viewBox="-2 -3 124 166"
            role="img"
            aria-label="AppLighters"
            style={{
                height,
                width: "auto",
                display: "block",
                flex: "none",
                overflow: "visible",
                filter: glow ? "drop-shadow(0 4px 12px rgba(190,8,255,.45))" : "none",
                ...style,
            }}
            {...props}
        >
            <defs>
                <linearGradient id={g("purple")} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D7A6FF" /><stop offset="1" stopColor="#7E2BD8" /></linearGradient>
                <linearGradient id={g("deep")} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B47E0" /><stop offset="1" stopColor="#5C18B0" /></linearGradient>
                <linearGradient id={g("body")} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#F5ECFC" /><stop offset="1" stopColor="#E3D0F4" /></linearGradient>
                <linearGradient id={g("flame")} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FDF4FF" /><stop offset=".24" stopColor="#EBC2FF" /><stop offset=".52" stopColor="#C15BF3" /><stop offset=".76" stopColor="#BE08FF" /><stop offset="1" stopColor="#7C1BCE" /></linearGradient>
                <linearGradient id={g("core")} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".5" stopColor="#F6E7FF" /><stop offset="1" stopColor="#E0B3FF" /></linearGradient>
                {animated && (
                    <radialGradient id={g("glow")} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#BE08FF" stopOpacity="0.7" /><stop offset="1" stopColor="#BE08FF" stopOpacity="0" /></radialGradient>
                )}
                {animated && <style>{FIRE_CSS}</style>}
            </defs>

            {animated ? (
                <g className="alm-fly">
                    <g transform="rotate(22 60 81.5)">
                        <ellipse className="alm-glow" cx="60" cy="132" rx="26" ry="30" fill={`url(#${g("glow")})`} />
                        {/* thin afterburner streak trailing the plume */}
                        <ellipse className="alm-streak" cx="60" cy="150" rx="3.6" ry="17" fill={`url(#${g("flame")})`} />
                        {/* fire: four layers licking at different rates — a wide
                            outer haze, the main plume, a mid tongue and a hot core */}
                        <g className="alm-tongue alm-t0"><path d={FLAME} transform="translate(60 118) scale(1.2) translate(-60 -118)" fill={`url(#${g("flame")})`} /></g>
                        <g className="alm-tongue alm-t1"><path d={FLAME} fill={`url(#${g("flame")})`} /></g>
                        <g className="alm-tongue alm-t2"><path d={FLAME} transform="translate(60 124) scale(0.82) translate(-60 -124)" fill={`url(#${g("flame")})`} /></g>
                        <g className="alm-tongue alm-t3"><path d={FLAME} transform="translate(60 126) scale(0.5) translate(-60 -126)" fill={`url(#${g("core")})`} /></g>
                        {/* white-hot spot right at the nozzle */}
                        <ellipse className="alm-hot" cx="60" cy="110" rx="7" ry="9" fill={`url(#${g("core")})`} />
                        {/* embers */}
                        <circle className="alm-spark alm-s1" cx="59" cy="150" r="2.1" fill="#EBC2FF" />
                        <circle className="alm-spark alm-s2" cx="62" cy="146" r="1.6" fill="#F6E7FF" />
                        <circle className="alm-spark alm-s3" cx="57" cy="147" r="1.4" fill="#D9A6FF" />
                        <circle className="alm-spark alm-s4" cx="64" cy="149" r="1.2" fill="#EBC2FF" />
                        <circle className="alm-spark alm-s5" cx="56" cy="152" r="1.7" fill="#FFFFFF" />
                        {body}
                    </g>
                </g>
            ) : (
                <g transform="rotate(22 60 81.5)">
                    {/* exhaust plume */}
                    <path d={FLAME} fill={`url(#${g("flame")})`} />
                    <path d={FLAME} fill={`url(#${g("core")})`} transform="translate(60 130) scale(0.52) translate(-60 -130)" />
                    {body}
                </g>
            )}
        </svg>
    );
}
