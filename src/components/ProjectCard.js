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
                        boxShadow:
                            "0 4px 14px rgba(0,0,0,0.45), 0 0 0 4px rgba(178,79,224,0.16)",
                    },
                    "& .pc-ai__face": { color: "#fff" },
                    // The ring only appears and rotates while the card is hovered;
                    // the keyframes are defined globally in styles/_bgAnim.scss.
                    "& .pc-ai__ring": { opacity: 1, animation: "pcAiRing 4.5s linear infinite" },
                },
            }}
        >
            {/* Styled in styles/_bgAnim.scss ("AI badge" block). Static at rest;
                the ring sweep is triggered by the card's :hover in sx below. */}
            {ai && (
                <Box className="pc-ai">
                    <Box component="span" className="pc-ai__ring" aria-hidden="true" />
                    <Box component="span" className="pc-ai__face">
                        <AutoAwesomeRoundedIcon className="pc-ai__spark" sx={{ fontSize: 11 }} />
                        AI
                    </Box>
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
