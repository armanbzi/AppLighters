const FLAME =
    "M53 107 C 49 120, 42 126, 47 136 C 50 143, 56 148, 60 155 C 64 148, 70 143, 73 136 C 78 126, 71 120, 67 107 Z";

// Flame + glow only run while the containing .pc-card is hovered/focused, so the
// portfolio icon sits still until you interact with it. Disabled under
// prefers-reduced-motion.
const CSS = `
.pc-fire{transform-box:fill-box;transform-origin:50% 0%}
.pc-glow{transform-box:fill-box;transform-origin:center;opacity:.42}
.pc-card:hover .pc-t1,.pc-card:focus-visible .pc-t1{animation:pc-lick1 .52s ease-in-out infinite}
.pc-card:hover .pc-t2,.pc-card:focus-visible .pc-t2{animation:pc-lick2 .40s ease-in-out infinite;animation-delay:-.13s}
.pc-card:hover .pc-t3,.pc-card:focus-visible .pc-t3{animation:pc-lick3 .30s ease-in-out infinite;animation-delay:-.21s}
.pc-card:hover .pc-glow,.pc-card:focus-visible .pc-glow{animation:pc-glowp .55s ease-in-out infinite}
@keyframes pc-lick1{0%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.9}22%{transform:scaleY(1.26) scaleX(.93) skewX(6deg);opacity:1}44%{transform:scaleY(.9) scaleX(1.06) skewX(-5deg);opacity:.82}66%{transform:scaleY(1.17) scaleX(.97) skewX(4deg);opacity:1}84%{transform:scaleY(.97) scaleX(1.03) skewX(-2deg);opacity:.9}100%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.9}}
@keyframes pc-lick2{0%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.9}25%{transform:scaleY(1.34) scaleX(.9) skewX(-7deg);opacity:1}50%{transform:scaleY(.85) scaleX(1.08) skewX(6deg);opacity:.8}75%{transform:scaleY(1.2) scaleX(.95) skewX(-4deg);opacity:1}100%{transform:scaleY(1) scaleX(1) skewX(0deg);opacity:.9}}
@keyframes pc-lick3{0%{transform:scaleY(1.05) scaleX(1) skewX(2deg);opacity:.95}30%{transform:scaleY(1.42) scaleX(.88) skewX(8deg);opacity:1}55%{transform:scaleY(.8) scaleX(1.1) skewX(-6deg);opacity:.85}80%{transform:scaleY(1.28) scaleX(.94) skewX(5deg);opacity:1}100%{transform:scaleY(1.05) scaleX(1) skewX(2deg);opacity:.95}}
@keyframes pc-glowp{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.75;transform:scale(1.14)}}
@media (prefers-reduced-motion:reduce){.pc-card:hover .pc-t1,.pc-card:focus-visible .pc-t1,.pc-card:hover .pc-t2,.pc-card:focus-visible .pc-t2,.pc-card:hover .pc-t3,.pc-card:focus-visible .pc-t3,.pc-card:hover .pc-glow,.pc-card:focus-visible .pc-glow{animation:none}}
`;

/**
 * The AppLighters app icon for the portfolio card — the rocket on its dark tile.
 * The purple flame burns (loops) only while the parent `.pc-card` is hovered or
 * focused; static otherwise. Fills its square container.
 */
export default function AppRocketIcon() {
    return (
        <svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-label="AppLighters" style={{ display: "block" }}>
            <defs>
                <radialGradient id="alpc-tile" cx="50%" cy="30%" r="85%"><stop offset="0" stopColor="#39194F" /><stop offset="1" stopColor="#150A22" /></radialGradient>
                <linearGradient id="alpc-purple" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D7A6FF" /><stop offset="1" stopColor="#7E2BD8" /></linearGradient>
                <linearGradient id="alpc-deep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B47E0" /><stop offset="1" stopColor="#5C18B0" /></linearGradient>
                <linearGradient id="alpc-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#F5ECFC" /><stop offset="1" stopColor="#E3D0F4" /></linearGradient>
                <linearGradient id="alpc-flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FDF4FF" /><stop offset=".24" stopColor="#EBC2FF" /><stop offset=".52" stopColor="#C15BF3" /><stop offset=".76" stopColor="#BE08FF" /><stop offset="1" stopColor="#7C1BCE" /></linearGradient>
                <linearGradient id="alpc-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".5" stopColor="#F6E7FF" /><stop offset="1" stopColor="#E0B3FF" /></linearGradient>
                <radialGradient id="alpc-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#BE08FF" stopOpacity="0.6" /><stop offset="1" stopColor="#BE08FF" stopOpacity="0" /></radialGradient>
                <style>{CSS}</style>
            </defs>
            <rect width="120" height="120" fill="url(#alpc-tile)" />
            <g transform="translate(60 62) scale(0.54) rotate(22) translate(-60 -81.5)">
                <ellipse className="pc-glow" cx="60" cy="132" rx="26" ry="30" fill="url(#alpc-glow)" />
                <g className="pc-fire pc-t1"><path d={FLAME} fill="url(#alpc-flame)" /></g>
                <g className="pc-fire pc-t2"><path d={FLAME} transform="translate(60 124) scale(0.82) translate(-60 -124)" fill="url(#alpc-flame)" /></g>
                <g className="pc-fire pc-t3"><path d={FLAME} transform="translate(60 126) scale(0.5) translate(-60 -126)" fill="url(#alpc-core)" /></g>
                <path d="M43 82 L27 108 L43 100 Z" fill="url(#alpc-deep)" />
                <path d="M77 82 L93 108 L77 100 Z" fill="url(#alpc-deep)" />
                <path d="M51 99 L69 99 L66 110 L54 110 Z" fill="url(#alpc-deep)" />
                <rect x="41" y="40" width="38" height="62" rx="11" fill="url(#alpc-body)" />
                <path d="M60 8 C 69 17, 76 28, 76 44 L 44 44 C 44 28, 51 17, 60 8 Z" fill="url(#alpc-purple)" />
                <rect x="41" y="45" width="38" height="4.2" fill="#E7D6F8" />
                <rect x="49.5" y="61.5" width="9" height="9" rx="2.6" fill="#7E2BD8" />
                <rect x="61.5" y="61.5" width="9" height="9" rx="2.6" fill="#7E2BD8" />
                <rect x="49.5" y="73.5" width="9" height="9" rx="2.6" fill="#9B47E0" />
                <rect x="61.5" y="73.5" width="9" height="9" rx="2.6" fill="#9B47E0" />
            </g>
        </svg>
    );
}
