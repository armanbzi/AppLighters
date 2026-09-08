import { Box } from "@mui/material";

// Unified modern background for the service pages (and any hero that wants it).
// Drifting, blurred gradient blobs over a faint dot grid — tinted by `accent`
// so each service feels distinct while staying in the purple brand world.
//
// Scoped to its container: position:absolute + inset:0, so drop it as the first
// child of a `position:relative` hero Box and render content above it at zIndex.
// Decorative and click-through. All motion is transform-based and settles under
// prefers-reduced-motion (keyframes live in styles/_bgAnim.scss).

const BRAND = "#B24FE0";

export default function AuroraBg({ accent = {}, children }) {
    const a = accent.a || "#C15BEE";
    const b = accent.b || "#7E2BD8";

    const blob = (color, opacity) =>
        `radial-gradient(circle at center, ${hexA(color, opacity)} 0%, ${hexA(color, 0)} 70%)`;

    return (
        <Box
            aria-hidden="true"
            className="aurora-bg"
            sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 0,
                // Faint dot grid for depth.
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                    maskImage:
                        "radial-gradient(ellipse at 50% 40%, #000 0%, transparent 80%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse at 50% 40%, #000 0%, transparent 80%)",
                    opacity: 0.7,
                },
            }}
        >
            <Box
                className="aurora-blob"
                sx={{
                    position: "absolute",
                    top: "-12%",
                    left: "-8%",
                    width: { xs: 380, md: 620 },
                    height: { xs: 380, md: 620 },
                    background: blob(a, 0.5),
                    filter: "blur(28px)",
                    animation: "blob-float-a 22s ease-in-out infinite",
                }}
            />
            <Box
                className="aurora-blob"
                sx={{
                    position: "absolute",
                    top: "20%",
                    right: "-12%",
                    width: { xs: 360, md: 560 },
                    height: { xs: 360, md: 560 },
                    background: blob(b, 0.45),
                    filter: "blur(30px)",
                    animation: "blob-float-b 26s ease-in-out infinite",
                }}
            />
            <Box
                className="aurora-blob"
                sx={{
                    position: "absolute",
                    bottom: "-18%",
                    left: "34%",
                    width: { xs: 320, md: 520 },
                    height: { xs: 320, md: 520 },
                    background: blob(BRAND, 0.4),
                    filter: "blur(26px)",
                    animation: "blob-float-c 30s ease-in-out infinite",
                }}
            />
            {children}
        </Box>
    );
}

// Expand a #RRGGBB hex to an rgba() string with the given alpha. Kept tiny and
// local so the data file can stay pure hex.
function hexA(hex, alpha) {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
