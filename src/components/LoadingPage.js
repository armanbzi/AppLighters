import React from "react";
import { Box } from "@mui/system";
import { Fade } from "@mui/material";

// The site loader: the AppLighters rocket easing up on a flickering flame.
// The whole rocket bobs (lp-lift), the flame flickers independently (lp-flicker),
// and the exhaust glow pulses (lp-glow) — three out-of-sync loops so it reads as
// live thrust rather than a canned tween. Honours prefers-reduced-motion.
export const LoadingPage = ({ isLoading }) => (
    <Fade in={isLoading} unmountOnExit>
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1120,
                backgroundColor: "rgba(20, 16, 26, 0.55)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
            }}
        >
            <Box
                sx={{
                    "@keyframes lp-lift": {
                        "0%": { transform: "translateY(6px)" },
                        "45%": { transform: "translateY(-8px)" },
                        "72%": { transform: "translateY(-3px)" },
                        "100%": { transform: "translateY(6px)" },
                    },
                    "@keyframes lp-flicker": {
                        "0%": { transform: "scaleY(1) scaleX(1)", opacity: 0.9 },
                        "20%": { transform: "scaleY(1.32) scaleX(0.92)", opacity: 1 },
                        "45%": { transform: "scaleY(0.78) scaleX(1.08)", opacity: 0.72 },
                        "70%": { transform: "scaleY(1.2) scaleX(0.96)", opacity: 1 },
                        "100%": { transform: "scaleY(1) scaleX(1)", opacity: 0.9 },
                    },
                    "@keyframes lp-glow": {
                        "0%, 100%": { opacity: 0.4, transform: "scale(1)" },
                        "50%": { opacity: 0.8, transform: "scale(1.16)" },
                    },
                    "& svg": { overflow: "visible", display: "block" },
                    "& .lp-rocket": {
                        animation: "lp-lift 1.7s ease-in-out infinite",
                        transformBox: "fill-box",
                        transformOrigin: "center",
                    },
                    "& .lp-flame": {
                        transformBox: "fill-box",
                        transformOrigin: "center top",
                        animation: "lp-flicker .4s ease-in-out infinite",
                    },
                    "& .lp-glow": {
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        animation: "lp-glow .9s ease-in-out infinite",
                    },
                    "@media (prefers-reduced-motion: reduce)": {
                        "& .lp-rocket, & .lp-flame, & .lp-glow": { animation: "none" },
                    },
                }}
            >
                <svg width="116" viewBox="0 0 120 156" role="img" aria-label="Loading">
                    <defs>
                        <linearGradient id="lp-purple" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D7A6FF" /><stop offset="1" stopColor="#7E2BD8" /></linearGradient>
                        <linearGradient id="lp-deep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9B47E0" /><stop offset="1" stopColor="#5C18B0" /></linearGradient>
                        <linearGradient id="lp-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#F5ECFC" /><stop offset="1" stopColor="#E3D0F4" /></linearGradient>
                        <linearGradient id="lp-flame-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FDF4FF" /><stop offset=".24" stopColor="#EBC2FF" /><stop offset=".52" stopColor="#C15BF3" /><stop offset=".76" stopColor="#BE08FF" /><stop offset="1" stopColor="#7C1BCE" /></linearGradient>
                        <linearGradient id="lp-core" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".45" stopColor="#F6E7FF" /><stop offset="1" stopColor="#DDA7FF" /></linearGradient>
                        <radialGradient id="lp-glow-g" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#BE08FF" stopOpacity="0.6" /><stop offset="1" stopColor="#BE08FF" stopOpacity="0" /></radialGradient>
                    </defs>
                    <g className="lp-rocket">
                        <ellipse className="lp-glow" cx="60" cy="130" rx="30" ry="36" fill="url(#lp-glow-g)" />
                        <g className="lp-flame">
                            <path d="M53 107 C 49 120, 42 126, 47 136 C 50 143, 56 148, 60 155 C 64 148, 70 143, 73 136 C 78 126, 71 120, 67 107 Z" fill="url(#lp-flame-g)" />
                            <path d="M53 107 C 49 120, 42 126, 47 136 C 50 143, 56 148, 60 155 C 64 148, 70 143, 73 136 C 78 126, 71 120, 67 107 Z" fill="url(#lp-core)" transform="translate(60 130) scale(0.52) translate(-60 -130)" />
                        </g>
                        <path d="M43 82 L27 108 L43 100 Z" fill="url(#lp-deep)" />
                        <path d="M77 82 L93 108 L77 100 Z" fill="url(#lp-deep)" />
                        <path d="M51 99 L69 99 L66 110 L54 110 Z" fill="url(#lp-deep)" />
                        <rect x="41" y="40" width="38" height="62" rx="11" fill="url(#lp-body)" />
                        <path d="M60 8 C 69 17, 76 28, 76 44 L 44 44 C 44 28, 51 17, 60 8 Z" fill="url(#lp-purple)" />
                        <rect x="41" y="45" width="38" height="4.2" fill="#E7D6F8" />
                        <rect x="49.5" y="61.5" width="9" height="9" rx="2.6" fill="#7E2BD8" />
                        <rect x="61.5" y="61.5" width="9" height="9" rx="2.6" fill="#7E2BD8" />
                        <rect x="49.5" y="73.5" width="9" height="9" rx="2.6" fill="#9B47E0" />
                        <rect x="61.5" y="73.5" width="9" height="9" rx="2.6" fill="#9B47E0" />
                    </g>
                </svg>
            </Box>
        </Box>
    </Fade>
);
