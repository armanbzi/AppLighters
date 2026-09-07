import { Box, Link, Typography } from "@mui/material";

// One client logo, normalized into a uniform light tile so wildly different
// source logos (transparent wordmarks, coloured squares, a globe) all read the
// same size and never overflow. Self-contained MUI — the old `.clientCard*`
// SCSS classes were removed in the animation refresh.
export default function ClCards({ title, img, url }) {
    return (
        <Box
            component={Link}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                transition: "transform .28s ease",
                "&:hover": { transform: "translateY(-6px)" },
                "&:hover .cl-tile": {
                    borderColor: "rgba(178,79,224,0.55)",
                    boxShadow: "0 18px 38px rgba(0,0,0,0.45)",
                },
            }}
        >
            <Box
                className="cl-tile"
                sx={{
                    width: "100%",
                    maxWidth: { xs: 150, sm: 190 },
                    height: { xs: 96, sm: 116 },
                    borderRadius: "16px",
                    background: "linear-gradient(180deg, #fbfaff 0%, #e9e5f1 100%)",
                    border: "1px solid rgba(255,255,255,0.55)",
                    boxShadow: "0 10px 26px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 2, sm: 2.5 },
                    transition: "border-color .28s ease, box-shadow .28s ease, transform .28s ease",
                }}
            >
                <Box
                    component="img"
                    src={img}
                    alt={title}
                    sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                />
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 14, fontWeight: 600, letterSpacing: ".01em" }}>
                {title}
            </Typography>
        </Box>
    );
}
