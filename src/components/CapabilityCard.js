import { useState } from "react";
import NextLink from "next/link";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CardBg from "./CardBg";

// One capability tile for the homepage grid. Instead of a static icon it runs a
// miniature of that service's own hero animation in the card background —
// drifting slowly at rest and accelerating while hovered/focused (see CardBg).
export default function CapabilityCard({ service, sx }) {
    const [hovered, setHovered] = useState(false);
    if (!service) return null;
    const { slug, name, tagline, accent } = service;

    return (
        <Box
            component={NextLink}
            href={`/services/${slug}`}
            className="cap-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                height: "100%",
                minHeight: { xs: 190, md: 210 },
                p: { xs: 3, md: 3.5 },
                borderRadius: "18px",
                bgcolor: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.09)",
                backdropFilter: "blur(6px)",
                overflow: "hidden",
                isolation: "isolate",
                transition:
                    "transform .28s ease, box-shadow .28s ease, border-color .28s ease, background-color .28s ease",
                "& .cap-arrow": {
                    opacity: 0,
                    transform: "translateX(-4px)",
                    transition: "opacity .28s ease, transform .28s ease",
                },
                "&:hover, &:focus-visible": {
                    transform: "translateY(-8px)",
                    borderColor: "rgba(178,79,224,0.55)",
                    backgroundColor: "rgba(178,79,224,0.06)",
                    boxShadow: "0 22px 45px rgba(0,0,0,0.45)",
                    outline: "none",
                    "& .cap-arrow": { opacity: 1, transform: "translateX(0)" },
                    "& .cap-bg": { opacity: 0.95 }, // art brightens as it speeds up
                },
                "&:focus-visible": { outline: "2px solid rgba(178,79,224,0.75)", outlineOffset: "3px" },
                ...sx,
            }}
        >
            <Box className="cap-bg" sx={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: "inherit", opacity: 0.62, transition: "opacity .3s ease" }}>
                <CardBg variant={slug} accent={accent} hovered={hovered} />
            </Box>

            <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <Typography
                    sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: 18, md: 20 }, lineHeight: 1.2, mb: 1 }}
                >
                    {name}
                </Typography>

                <Typography
                    sx={{ color: "rgba(255,255,255,0.65)", fontSize: { xs: 14, md: 15 }, lineHeight: 1.6, mb: 2, maxWidth: 300 }}
                >
                    {tagline}
                </Typography>

                <Box
                    className="cap-arrow"
                    sx={{
                        mt: "auto",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#C98BFF",
                        fontWeight: 600,
                        fontSize: 14,
                    }}
                >
                    Learn more
                    <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
                </Box>
            </Box>
        </Box>
    );
}
