import { useRef } from "react";
import { Box, Typography } from "@mui/material";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import showcaseApps from "../data/showcaseApps";
import useMarquee from "./useMarquee";

// The chain of our apps drifting right-to-left under the hero. Motion, drag and
// throw physics all live in useMarquee; this file is just the chip design.
// A tap opens the app, a drag does not (useMarquee flags real drags in
// draggedRef and we preventDefault on the click).

const COPIES = 3;

export default function AppsTicker() {
    const wrapRef = useRef(null);
    const trackRef = useRef(null);
    const draggedRef = useRef(false);

    useMarquee({ wrapRef, trackRef, copies: COPIES, drift: 38, draggedRef });

    const items = Array.from({ length: COPIES }).flatMap((_, c) =>
        showcaseApps.map((a) => ({ ...a, key: `${c}-${a.name}` }))
    );

    return (
        <Box
            ref={wrapRef}
            sx={{
                position: "relative",
                overflow: "hidden", // the track is far wider than the page
                // headroom for the name that floats up on hover
                pt: { xs: 5, md: 6 },
                pb: 1.5,
                cursor: "grab",
                touchAction: "pan-y", // keep vertical page scrolling on touch
                userSelect: "none",
                WebkitUserSelect: "none",
                // fade the chain out well before the edges, so apps dissolve in
                // and out with room to spare rather than clipping at the sides
                maskImage: "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            }}
        >
            <Box ref={trackRef} sx={{ display: "flex", alignItems: "center", gap: { xs: 3, md: 4.5 }, width: "max-content", willChange: "transform" }}>
                {items.map((a) => (
                    <Box
                        key={a.key}
                        component="a"
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={a.name}
                        draggable={false}
                        onClick={(e) => { if (draggedRef.current) e.preventDefault(); }}
                        sx={{
                            flex: "0 0 auto",
                            position: "relative",
                            display: "block",
                            textDecoration: "none",
                            // resting state: calm and slightly desaturated so the row
                            // reads as one texture; each logo blooms on hover.
                            "& .tk-tile": {
                                transition: "transform .3s cubic-bezier(.34,1.4,.64,1), filter .3s ease, opacity .3s ease, box-shadow .3s ease",
                                filter: "grayscale(0.3) brightness(0.9)",
                                opacity: 0.82,
                            },
                            "& .tk-ring": { opacity: 0, transition: "opacity .3s ease" },
                            "& .tk-name": { opacity: 0, transform: "translateX(-50%) translateY(8px)", transition: "opacity .28s ease, transform .28s ease" },
                            "&:hover, &:focus-visible": {
                                outline: "none",
                                "& .tk-tile": {
                                    transform: "translateY(-6px) scale(1.1)",
                                    filter: "none",
                                    opacity: 1,
                                    boxShadow: "0 16px 34px rgba(0,0,0,0.55), 0 0 26px rgba(201,139,255,0.4)",
                                },
                                "& .tk-ring": { opacity: 1 },
                                "& .tk-name": { opacity: 1, transform: "translateX(-50%) translateY(0)" },
                            },
                        }}
                    >
                        {/* name, floating above on hover */}
                        <Box
                            className="tk-name"
                            sx={{
                                position: "absolute",
                                bottom: "calc(100% + 14px)",
                                left: "50%",
                                px: 1.5,
                                py: 0.75,
                                borderRadius: "10px",
                                whiteSpace: "nowrap",
                                bgcolor: "rgba(20,16,28,0.94)",
                                border: "1px solid rgba(201,139,255,0.35)",
                                backdropFilter: "blur(8px)",
                                boxShadow: "0 10px 24px rgba(0,0,0,0.5)",
                                pointerEvents: "none",
                                zIndex: 3,
                            }}
                        >
                            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1, display: "flex", alignItems: "center", gap: 0.6 }}>
                                {a.name}
                                <NorthEastRoundedIcon sx={{ fontSize: 13, color: "#C98BFF" }} />
                            </Typography>
                        </Box>

                        <Box
                            className="tk-tile"
                            sx={{
                                position: "relative",
                                width: { xs: 54, md: 64 },
                                height: { xs: 54, md: 64 },
                                borderRadius: "18px",
                                isolation: "isolate",
                            }}
                        >
                            {/* rotating gradient ring — same language as the hero rings */}
                            <Box
                                className="tk-ring"
                                aria-hidden="true"
                                sx={{ position: "absolute", inset: "-3px", borderRadius: "21px", overflow: "hidden", zIndex: 0 }}
                            >
                                <Box sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    width: "220%",
                                    aspectRatio: "1",
                                    transform: "translate(-50%, -50%)",
                                    background: "conic-gradient(from 0deg, rgba(201,139,255,0) 0deg, #C98BFF 90deg, rgba(126,43,216,0) 200deg, #F1E4FF 300deg, rgba(201,139,255,0) 360deg)",
                                    animation: "aura-spin 4s linear infinite",
                                }} />
                            </Box>
                            <Box
                                component="img"
                                src={a.img}
                                alt=""
                                draggable={false}
                                sx={{
                                    position: "relative",
                                    zIndex: 1,
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "18px",
                                    objectFit: "cover",
                                    display: "block",
                                    pointerEvents: "none",
                                }}
                            />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
