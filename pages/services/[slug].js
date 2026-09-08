import Layout from "../../src/components/Layout";
import AuroraBg from "../../src/components/AuroraBg";
import AiHeroBg from "../../src/components/AiHeroBg";
import DataHeroBg from "../../src/components/DataHeroBg";
import CostHeroBg from "../../src/components/CostHeroBg";
import AutoHeroBg from "../../src/components/AutoHeroBg";
import CloudHeroBg from "../../src/components/CloudHeroBg";
import SecurityHeroBg from "../../src/components/SecurityHeroBg";
import UiHeroBg from "../../src/components/UiHeroBg";
import ProjectCard from "../../src/components/ProjectCard";
import CapabilityCard from "../../src/components/CapabilityCard";
import useReveal from "../../src/components/useReveal";
import { scrollToEstimate } from "../../src/lib/scroll";
import { pageContainer } from "../../src/lib/layout";
import { services, serviceSlugs, getService } from "../../src/data/services";
import aiApps from "../../src/data/aiApps";
import NextLink from "next/link";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

// Per-service hero background — every service has its own bespoke animated
// scene (AuroraBg remains as the fallback for any future service).
const HERO_BACKGROUNDS = {
    "ai-integration": AiHeroBg, // rockets with icon sticker decals in space
    "data-storage": DataHeroBg, // rotating geometric data mandala
    "cost-optimization": CostHeroBg, // bar skyline squashed by an optimization wave
    "automation": AutoHeroBg, // CI/CD pipeline with stations, merging branch, gears
    "cloud-scaling": CloudHeroBg, // drifting clouds + auto-scaling node cluster
    "security-reliability": SecurityHeroBg, // radar sweep clearing blips + deflecting shield
    "ui-ux": UiHeroBg, // design pass painting wireframe screens into polished UI
};

export default function ServicePage({ slug }) {
    const service = getService(slug);
    const HeroBg = HERO_BACKGROUNDS[slug];
    const [overviewRef, overviewCls] = useReveal();
    const [includedRef, includedCls] = useReveal();
    const [proofRef, proofCls] = useReveal();
    const [moreRef, moreCls] = useReveal();

    if (!service) return null; // getStaticPaths only emits real slugs

    const { name, tagline, overview, accent, included, outcomes } = service;
    const others = services.filter((s) => s.slug !== slug).slice(0, 3);

    const grid = {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: { xs: 2.5, lg: 3 },
    };

    return (
        <Layout>
            {/* Hero */}
            <Box
                sx={{
                    position: "relative",
                    minHeight: { xs: "78vh", md: "76vh" },
                    marginTop: "-100px",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    background: "radial-gradient(ellipse at 50% 0%, #241830 0%, #0d0b12 72%)",
                }}
            >
                {/* Hero animation dialed back a touch so the title/tagline read clearly over it */}
                <Box sx={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.8 }}>
                    {HeroBg ? <HeroBg /> : <AuroraBg accent={accent} />}
                </Box>
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 2,
                        width: "100%",
                        maxWidth: 900,
                        mx: "auto",
                        textAlign: "center",
                        px: { xs: 3, sm: 4 },
                        pt: "100px",
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: { xs: 34, sm: 46, lg: 56 },
                            lineHeight: 1.08,
                            letterSpacing: "-0.02em",
                            background: "linear-gradient(118deg, #ffffff 0%, #f1e4ff 45%, #C98BFF 100%)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 2.5,
                            // keeps the gradient title crisp over the animated scenes
                            filter: "drop-shadow(0 2px 14px rgba(0,0,0,0.65))",
                        }}
                    >
                        {name}
                    </Typography>

                    <Typography
                        sx={{
                            color: "rgba(255,255,255,.82)",
                            fontSize: { xs: 16, sm: 18, lg: 20 },
                            lineHeight: 1.6,
                            maxWidth: 620,
                            mx: "auto",
                            mb: 4,
                            textShadow: "0 1px 10px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.5)",
                        }}
                    >
                        {tagline}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                            onClick={scrollToEstimate}
                            variant="contained"
                            size="large"
                            sx={{ px: 4, py: 1.25, fontSize: { xs: 14, lg: 16 }, fontWeight: 700 }}
                        >
                            Boost My App
                        </Button>
                        <Button
                            component={NextLink}
                            href="/Portfolio"
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.25,
                                fontSize: { xs: 14, lg: 16 },
                                fontWeight: 700,
                                color: "#fff",
                                borderColor: "rgba(255,255,255,0.28)",
                                "&:hover": { borderColor: "#C98BFF", backgroundColor: "rgba(201,139,255,0.08)" },
                            }}
                        >
                            See Our Work
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Overview + outcomes */}
            <Box
                sx={{
                    background: "linear-gradient(180deg, #241f2e 0%, #1b1722 100%)",
                    color: "#fff",
                    py: { xs: 8, lg: 12 },
                    px: { xs: 3, sm: 4 },
                }}
            >
                <Box ref={overviewRef} className={overviewCls} sx={{ maxWidth: 820, mx: "auto", textAlign: "center", mb: { xs: 6, lg: 8 } }}>
                    <Typography sx={{ color: "rgba(255,255,255,.75)", fontSize: { xs: 16, sm: 18, lg: 19 }, lineHeight: 1.8 }}>
                        {overview}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                        gap: { xs: 2, sm: 3 },
                        maxWidth: 760,
                        mx: "auto",
                    }}
                >
                    {outcomes.map((o, i) => (
                        <Box
                            key={i}
                            sx={{
                                textAlign: "center",
                                p: { xs: 2.5, md: 3 },
                                borderRadius: "16px",
                                bgcolor: "rgba(255,255,255,0.035)",
                                border: "1px solid rgba(255,255,255,0.09)",
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, md: 30 }, color: "#C98BFF", lineHeight: 1.1, mb: 0.75 }}>
                                {o.stat}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.45 }}>
                                {o.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* What's included */}
            <Box
                sx={{
                    background: "linear-gradient(180deg, #191521 0%, #14111b 100%)",
                    color: "#fff",
                    py: { xs: 8, lg: 12 },
                }}
            >
                <Box ref={includedRef} className={includedCls} sx={pageContainer}>
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: { xs: 26, sm: 32, lg: 38 },
                            mb: { xs: 5, lg: 7 },
                        }}
                    >
                        What&apos;s included
                    </Typography>

                    <Box sx={grid}>
                        {included.map((item, i) => {
                            const ItemIcon = item.icon;
                            return (
                                <Box
                                    key={i}
                                    sx={{
                                        p: { xs: 2.75, md: 3 },
                                        borderRadius: "16px",
                                        bgcolor: "rgba(255,255,255,0.035)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        transition: "border-color .25s ease, background-color .25s ease, transform .25s ease",
                                        "&:hover": {
                                            borderColor: "rgba(178,79,224,0.4)",
                                            backgroundColor: "rgba(178,79,224,0.05)",
                                            transform: "translateY(-4px)",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#C98BFF",
                                            bgcolor: "rgba(178,79,224,0.12)",
                                            mb: 2,
                                        }}
                                    >
                                        {ItemIcon ? <ItemIcon sx={{ fontSize: 24 }} /> : <CheckRoundedIcon sx={{ fontSize: 24 }} />}
                                    </Box>
                                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 17, mb: 0.75 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14.5, lineHeight: 1.6 }}>
                                        {item.blurb}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>

            {/* Proof — apps we've lit up */}
            <Box
                sx={{
                    background: "linear-gradient(180deg, #14111b 0%, #0f0d14 100%)",
                    color: "#fff",
                    py: { xs: 8, lg: 12 },
                }}
            >
                <Box ref={proofRef} className={proofCls} sx={pageContainer}>
                    <Typography sx={{ textAlign: "center", color: "#B24FE0", fontWeight: 700, letterSpacing: ".24em", fontSize: { xs: 12, lg: 13 }, mb: 1.5 }}>
                        PROOF
                    </Typography>
                    <Typography sx={{ textAlign: "center", color: "#fff", fontWeight: 800, fontSize: { xs: 24, sm: 30, lg: 36 }, mb: { xs: 5, lg: 7 } }}>
                        Apps we&apos;ve lit up
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" },
                            gap: { xs: 2.5, lg: 3 },
                        }}
                    >
                        {aiApps.map((app) => (
                            <ProjectCard key={app.name} {...app} ai />
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Explore other services */}
            <Box
                sx={{
                    background: "linear-gradient(180deg, #0f0d14 0%, #17151d 100%)",
                    color: "#fff",
                    py: { xs: 8, lg: 12 },
                }}
            >
                <Box ref={moreRef} className={moreCls} sx={pageContainer}>
                    <Typography sx={{ textAlign: "center", color: "#fff", fontWeight: 800, fontSize: { xs: 24, sm: 30, lg: 36 }, mb: { xs: 5, lg: 7 } }}>
                        More ways we can help
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                            gap: { xs: 2.5, lg: 3 },
                        }}
                    >
                        {others.map((s) => (
                            <CapabilityCard key={s.slug} service={s} />
                        ))}
                    </Box>
                    <Box sx={{ textAlign: "center", mt: { xs: 5, lg: 6 } }}>
                        <Button
                            component={NextLink}
                            href="/#capabilities"
                            variant="text"
                            sx={{ color: "#C98BFF", fontWeight: 700, fontSize: 15 }}
                            endIcon={<ArrowForwardRoundedIcon />}
                        >
                            See all capabilities
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}

export function getStaticPaths() {
    return {
        paths: serviceSlugs.map((slug) => ({ params: { slug } })),
        fallback: false,
    };
}

export function getStaticProps({ params }) {
    // Only the slug crosses the SSG boundary — service objects hold React icon
    // components, which are not serializable. The component resolves the full
    // object from src/data/services.js via getService(slug).
    if (!serviceSlugs.includes(params.slug)) return { notFound: true };
    return { props: { slug: params.slug } };
}
