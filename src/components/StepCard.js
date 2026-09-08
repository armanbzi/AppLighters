import { useState } from "react";
import { Box, Typography } from "@mui/material";
import CardBg from "./CardBg";

// One "How it works" step. Same language as the capability cards: no icon, an
// animated background that fits the step (scan / route / acceleration) which
// speeds up on hover, and the step number carried as a large ghost numeral.
export default function StepCard({ step, index }) {
    const [hovered, setHovered] = useState(false);
    if (!step) return null;
    const { title, blurb, variant, accent } = step;

    return (
        <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: { xs: 200, md: 230 },
                p: { xs: 3, md: 3.5 },
                borderRadius: "18px",
                bgcolor: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                isolation: "isolate",
                transition: "transform .28s ease, border-color .28s ease, background-color .28s ease, box-shadow .28s ease",
                "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "rgba(178,79,224,0.45)",
                    backgroundColor: "rgba(178,79,224,0.05)",
                    boxShadow: "0 20px 42px rgba(0,0,0,0.45)",
                    "& .step-bg": { opacity: 0.95 },
                    "& .step-num": { color: "rgba(255,255,255,0.5)" },
                },
            }}
        >
            <Box className="step-bg" sx={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: "inherit", opacity: 0.6, transition: "opacity .3s ease" }}>
                <CardBg variant={variant} accent={accent} hovered={hovered} />
            </Box>

            <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <Typography
                    className="step-num"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: 34, md: 40 },
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                        color: "rgba(255,255,255,0.26)",
                        transition: "color .28s ease",
                        mb: 1.5,
                    }}
                >
                    {String(index + 1).padStart(2, "0")}
                </Typography>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: 19, md: 20 }, mb: 1 }}>
                    {title}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: 15, lineHeight: 1.65, maxWidth: 300 }}>
                    {blurb}
                </Typography>
            </Box>
        </Box>
    );
}
