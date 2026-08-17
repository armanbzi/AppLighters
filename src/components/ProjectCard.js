import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

// Two initials from the name's capitals (ToastAi -> TA), falling back to the
// first two characters for names that carry none.
function initialsFor(name) {
    const caps = (name || "").replace(/[^A-Za-z0-9 ]/g, " ").match(/[A-Z]/g);
    if (caps && caps.length) return caps.join("").slice(0, 2);
    return (name || "?").slice(0, 2).toUpperCase();
}

export default function ProjectCard({ name, img, url, frameWorks = [], ai = false }) {
    const tags = (frameWorks || []).filter(Boolean);
    const isExternal = typeof url === "string" && url.startsWith("http");
    const [imgFailed, setImgFailed] = useState(false);
    const showTile = !img || imgFailed;

    return (
        <Box
            component="a"
            href={url || "/"}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            sx={{
                textDecoration: "none",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                height: "100%",
                p: { xs: 2.5, sm: 3 },
                borderRadius: "18px",
                bgcolor: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.09)",
                backdropFilter: "blur(6px)",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                outline: "none",
                "&:focus-visible": {
                    outline: "2px solid rgba(178,79,224,0.75)",
                    outlineOffset: "3px",
                },
                "& .pc-tags, & .pc-cta": {
                    opacity: 0,
                    transform: "translateY(8px)",
                    transition: "opacity .32s ease, transform .32s ease",
                },
                "&:hover .pc-tags, &:hover .pc-cta, &:focus-visible .pc-tags, &:focus-visible .pc-cta": {
                    opacity: 1,
                    transform: "translateY(0)",
                },
                transition:
                    "transform .28s ease, box-shadow .28s ease, border-color .28s ease, background-color .28s ease",
                "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "rgba(178,79,224,0.55)",
                    backgroundColor: "rgba(178,79,224,0.06)",
                    boxShadow: "0 22px 45px rgba(0,0,0,0.45)",
                    "& .pc-logo": { transform: "scale(1.05)" },
                    "& .pc-cta": { color: "#C98BFF" },
                    "& .pc-cta svg": { transform: "translate(2px,-2px)" },
                    "& .pc-ai": {
                        borderColor: "rgba(201,139,255,0.72)",
                        color: "#fff",
                        boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 14px rgba(0,0,0,0.42), 0 0 0 4px rgba(178,79,224,0.14)",
                    },
                },
            }}
        >
            {ai && (
                <Box
                    className="pc-ai"
                    sx={{
                        position: "absolute",
                        top: 11,
                        right: 11,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        // Right padding is lighter than left: the label's letter-spacing
                        // adds trailing space after the "I", so equal padding reads
                        // optically off-centre.
                        pl: "8px",
                        pr: "7px",
                        py: "5px",
                        borderRadius: "999px",
                        // A tinted glass chip: purple wash over a dark base so the badge
                        // holds its own contrast on both a pale logo and a dark card.
                        background:
                            "linear-gradient(150deg, rgba(201,139,255,0.30) 0%, rgba(126,43,216,0.20) 55%, rgba(126,43,216,0.10) 100%), rgba(18,14,28,0.55)",
                        border: "1px solid rgba(201,139,255,0.38)",
                        // Inset highlight for the lit top edge, then lift, then a faint
                        // purple halo so the chip separates from the card border.
                        boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.16), 0 2px 10px rgba(0,0,0,0.38), 0 0 0 3px rgba(178,79,224,0.06)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        color: "#F1E4FF",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: ".14em",
                        lineHeight: 1,
                        textTransform: "uppercase",
                        transition: "border-color .28s ease, box-shadow .28s ease, color .28s ease",
                    }}
                >
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 11, color: "#D9A6FF" }} />
                    AI
                </Box>
            )}

            <Box
                className="pc-logo"
                sx={{
                    width: 92,
                    height: 92,
                    borderRadius: "16px",
                    overflow: "hidden",
                    mb: 2.5,
                    flexShrink: 0,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                    transition: "transform .28s ease",
                    bgcolor: "rgba(0,0,0,0.25)",
                }}
            >
                {showTile ? (
                    <Box
                        aria-hidden="true"
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, #C98BFF 0%, #7E2BD8 100%)",
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 32,
                            letterSpacing: ".02em",
                            lineHeight: 1,
                        }}
                    >
                        {initialsFor(name)}
                    </Box>
                ) : (
                    <img
                        src={img}
                        alt={name}
                        loading="lazy"
                        onError={() => setImgFailed(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                )}
            </Box>

            <Typography
                sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: { xs: 17, sm: 19 },
                    letterSpacing: ".01em",
                    lineHeight: 1.25,
                    mb: 1.5,
                }}
            >
                {name}
            </Typography>

            {tags.length > 0 && (
                <Stack
                    className="pc-tags"
                    direction="row"
                    useFlexGap
                    flexWrap="wrap"
                    justifyContent="center"
                    spacing={0.8}
                    sx={{ mb: 2.5 }}
                >
                    {tags.map((t, i) => (
                        <Box
                            key={i}
                            component="span"
                            sx={{
                                px: 1.2,
                                py: 0.4,
                                borderRadius: "999px",
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#d9b8f0",
                                bgcolor: "rgba(178,79,224,0.14)",
                                border: "1px solid rgba(178,79,224,0.32)",
                                whiteSpace: "nowrap",
                                lineHeight: 1.4,
                            }}
                        >
                            {t}
                        </Box>
                    ))}
                </Stack>
            )}

            <Box
                className="pc-cta"
                sx={{
                    mt: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#B24FE0",
                    fontWeight: 600,
                    fontSize: 14,
                    transition: "color .28s ease",
                }}
            >
                View project
                <OpenInNewRoundedIcon sx={{ fontSize: 16, transition: "transform .28s ease" }} />
            </Box>
        </Box>
    );
}
