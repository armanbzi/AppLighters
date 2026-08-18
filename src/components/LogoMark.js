import { useId } from "react";

/**
 * AppLighters logomark — the "App" launch rocket riding its Lighter Flame thrust.
 * Transparent background, tuned for dark surfaces (nav, footer). Size via `height`
 * (width auto-scales to the 120:156 aspect). `glow` adds the flame drop-shadow.
 *
 * Gradient ids are namespaced with useId() so the mark can render more than once
 * on a page (e.g. nav + footer) without duplicate-id collisions.
 */
export default function LogoMark({ height = 40, glow = false, style, ...props }) {
    const uid = useId().replace(/:/g, "");
    const g = (n) => `${uid}-${n}`;
    const flame = "M53 107 C 49 120, 42 126, 47 136 C 50 143, 56 148, 60 155 C 64 148, 70 143, 73 136 C 78 126, 71 120, 67 107 Z";
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
                <linearGradient id={g("core")} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".45" stopColor="#F6E7FF" /><stop offset="1" stopColor="#DDA7FF" /></linearGradient>
            </defs>
            {/* tilt the whole rocket ~22° to the right so the nose leans into the wordmark */}
            <g transform="rotate(22 60 81.5)">
            {/* exhaust plume */}
            <path d={flame} fill={`url(#${g("flame")})`} />
            <path d={flame} fill={`url(#${g("core")})`} transform="translate(60 130) scale(0.52) translate(-60 -130)" />
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
            </g>
        </svg>
    );
}
