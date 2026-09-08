import { useRef } from "react";
import { Box, Typography } from "@mui/material";
import useMarquee from "./useMarquee";

// The outcomes band as a slow right-to-left slider (same physics as the hero
// apps chain — grab and flick it too). Each stat is a glass pill; a small
// diamond separates them so the row reads as one continuous ribbon.
const COPIES = 3;

export default function StatsTicker({ items = [] }) {
    const wrapRef = useRef(null);
    const trackRef = useRef(null);

    useMarquee({ wrapRef, trackRef, copies: COPIES, drift: 26 });

    const all = Array.from({ length: COPIES }).flatMap((_, c) =>
        items.map((o, i) => ({ ...o, key: `${c}-${i}` }))
    );

    return (
        <Box
            ref={wrapRef}
            sx={{
                position: "relative",
                overflow: "hidden",
                py: 1,
                cursor: "grab",
                touchAction: "pan-y",
                userSelect: "none",
                WebkitUserSelect: "none",
                maskImage: "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
            }}
        >
            <Box ref={trackRef} sx={{ display: "flex", alignItems: "center", width: "max-content", willChange: "transform" }}>
                {all.map((o) => (
                    <Box key={o.key} sx={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
                        <Box
                            className="st-item"
                            sx={{
                                display: "flex",
                                alignItems: "stretch",
                                gap: { xs: 1.75, md: 2.25 },
                                px: { xs: 2, md: 3 },
                                py: { xs: 1.25, md: 1.5 },
                                borderRadius: "14px",
                                whiteSpace: "nowrap",
                                transition: "background-color .28s ease",
                                "& .st-bar": { transition: "box-shadow .28s ease, opacity .28s ease", opacity: 0.85 },
                                "&:hover": {
                                    bgcolor: "rgba(178,79,224,0.06)",
                                    "& .st-bar": { opacity: 1, boxShadow: "0 0 16px rgba(201,139,255,0.65)" },
                                },
                            }}
                        >
                            {/* gradient accent bar instead of a boxed border */}
                            <Box
                                className="st-bar"
                                aria-hidden="true"
                                sx={{
                                    width: 3,
                                    flexShrink: 0,
                                    borderRadius: 2,
                                    background: "linear-gradient(180deg, #F1E4FF 0%, #C98BFF 45%, #7E2BD8 100%)",
                                    boxShadow: "0 0 10px rgba(201,139,255,0.35)",
                                }}
                            />
                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: 26, md: 34 },
                                        lineHeight: 1.05,
                                        letterSpacing: "-0.02em",
                                        background: "linear-gradient(118deg, #ffffff 0%, #f1e4ff 42%, #C98BFF 100%)",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {o.stat}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        color: "rgba(255,255,255,0.5)",
                                        fontSize: { xs: 11, md: 12 },
                                        fontWeight: 600,
                                        letterSpacing: ".14em",
                                        textTransform: "uppercase",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {o.label}
                                </Typography>
                            </Box>
                        </Box>
                        {/* hairline separator */}
                        <Box
                            aria-hidden="true"
                            sx={{
                                width: "1px",
                                height: { xs: 34, md: 42 },
                                mx: { xs: 1.5, md: 2.5 },
                                flexShrink: 0,
                                background: "linear-gradient(180deg, rgba(201,139,255,0) 0%, rgba(201,139,255,0.35) 50%, rgba(201,139,255,0) 100%)",
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
