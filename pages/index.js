import Layout from "../src/components/Layout";
import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import HeroAura from "../src/components/HeroAura";
import AppsTicker from "../src/components/AppsTicker";
import CapabilityCard from "../src/components/CapabilityCard";
import RocketWorksScene from "../src/components/RocketWorksScene";
import StepCard from "../src/components/StepCard";
import StatsTicker from "../src/components/StatsTicker";
import ClCards from "../src/components/ClCards";
import useReveal from "../src/components/useReveal";
import { scrollToEstimate } from "../src/lib/scroll";
import { pageContainer } from "../src/lib/layout";
import { services } from "../src/data/services";

const STEPS = [
    { title: "Audit", variant: "audit", accent: { a: "#C15BEE", b: "#7E2BD8" }, blurb: "We dig into your app, infrastructure and bills to find the biggest, fastest wins." },
    { title: "Plan", variant: "plan", accent: { a: "#A78BFA", b: "#6366F1" }, blurb: "You get a clear, prioritized roadmap — each improvement scored by impact and effort." },
    { title: "Boost", variant: "boost", accent: { a: "#E879F9", b: "#A855F7" }, blurb: "We implement, measure the difference, and hand back a faster, smarter, leaner app." },
];


// Every outcome card from every service page, so the home chain carries the
// full set of proof points rather than a separate hardcoded list.
const OUTCOMES = services.flatMap((s) => s.outcomes);

export default function Home() {
    const [capRef, capCls] = useReveal();
    const [outRef, outCls] = useReveal();
    const [stepRef, stepCls] = useReveal();
    const [cliRef, cliCls] = useReveal();

    const overline = {
        color: "#B24FE0",
        fontWeight: 700,
        letterSpacing: ".24em",
        fontSize: { xs: 12, lg: 13 },
        mb: 1.5,
    };
    const sectionTitle = {
        color: "#fff",
        fontWeight: 800,
        fontSize: { xs: 34, sm: 44, lg: 54 },
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        background: "linear-gradient(118deg, #ffffff 0%, #f1e4ff 45%, #C98BFF 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
    };

    return (
        <Layout>
            {/* Hero */}
            <Box sx={{
                position: "relative",
                minHeight: "100vh",
                marginTop: "-100px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "radial-gradient(ellipse at 50% 42%, #2a1b33 0%, #17131d 72%)",
            }}>
                <HeroAura />
                <Box sx={{ ...pageContainer, position: "relative", zIndex: 2, textAlign: "center", pt: "100px", pb: { xs: 16, md: 14 } }}>
                    <Typography component="h1" sx={{ ...sectionTitle, fontSize: { xs: 38, sm: 54, lg: 68 }, mb: 3, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 3px 16px rgba(0,0,0,0.7))" }}>
                        We Light Up Your App
                    </Typography>

                    <Typography sx={{ color: "#fff", fontSize: { xs: 16, sm: 18, lg: 20 }, lineHeight: 1.65, maxWidth: 620, mx: "auto", mb: { xs: 3.5, md: 4.5 }, fontWeight: 500, textShadow: "0 1px 2px rgba(0,0,0,0.98), 0 0 8px rgba(0,0,0,0.9), 0 2px 22px rgba(0,0,0,0.85)" }}>
                        Already have an app? We make it smarter, faster, leaner and more reliable &mdash;
                        adding AI, optimizing data, cutting cloud costs, and scaling it for whatever comes next.
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button onClick={scrollToEstimate} variant="contained" size="large"
                            sx={{ px: 4, py: 1.4, fontSize: { xs: 14, lg: 16 }, fontWeight: 700 }}>
                            Boost My App
                        </Button>
                        <Button component={NextLink} href="/Portfolio" variant="outlined" size="large"
                            sx={{
                                px: 4, py: 1.4, fontSize: { xs: 14, lg: 16 }, fontWeight: 700, color: "#fff",
                                borderColor: "rgba(255,255,255,0.28)",
                                "&:hover": { borderColor: "#C98BFF", backgroundColor: "rgba(201,139,255,0.08)" },
                            }}>
                            See Our Work
                        </Button>
                    </Box>
                </Box>

                {/* The chain of our apps, drifting along the bottom of the hero */}
                <Box sx={{
                    position: "absolute",
                    left: 0, right: 0,
                    bottom: { xs: 20, md: 34 },
                    zIndex: 2,
                    display: "flex",
                    justifyContent: "center",
                }}>
                    <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: 620, md: 900, lg: 1040 }, px: { xs: 2, sm: 0 } }}>
                        <AppsTicker />
                    </Box>
                </Box>
            </Box>

            {/* Capabilities */}
            <Box id="capabilities" sx={{
                background: "linear-gradient(180deg, #241f2e 0%, #1b1722 100%)",
                color: "white",
                py: { xs: 8, lg: 13 },
            }}>
                <Box ref={capRef} className={capCls} sx={pageContainer}>
                    <Box sx={{ textAlign: "center", maxWidth: 820, mx: "auto", mb: { xs: 6, lg: 9 } }}>
                        <Typography sx={overline}>WHAT WE DO</Typography>
                        <Typography sx={{ ...sectionTitle, mb: 2.5 }}>How we light up your app</Typography>
                        <Typography sx={{ color: "rgba(255,255,255,.65)", fontSize: { xs: 15, sm: 17, lg: 18 }, lineHeight: 1.75 }}>
                            Seven ways we boost the product you already run &mdash; no rebuild required. Pick a starting
                            point, or let us audit your app and tell you where the biggest wins are.
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
                        gap: { xs: 2.5, lg: 3 },
                        // 7 cards ring the rocket service-bay scene at lg (it takes the
                        // middle cells of the first two rows). Below lg the scene is a
                        // full-width band and cards auto-flow; the odd 7th card centers.
                        "& > a:nth-of-type(2n+1):last-of-type": {
                            gridColumn: { sm: "1 / -1", lg: "2" },
                            justifySelf: { sm: "center", lg: "stretch" },
                            width: { sm: "calc(50% - 10px)", lg: "100%" },
                        },
                    }}>
                        {[
                            ["ai-integration", "1", "1"],
                            ["data-storage", "1", "3"],
                            ["cost-optimization", "3", "1"],
                            ["automation", "1", "2"],
                        ].map(([slug, col, row]) => (
                            <CapabilityCard
                                key={slug}
                                service={services.find((s) => s.slug === slug)}
                                sx={{ gridColumn: { lg: col }, gridRow: { lg: row } }}
                            />
                        ))}
                        <RocketWorksScene sx={{
                            gridColumn: { xs: "1 / -1", lg: "2" },
                            gridRow: { lg: "1 / span 2" },
                            height: { xs: 340, sm: 400, lg: "100%" },
                            minHeight: { lg: 420 },
                        }} />
                        {[
                            ["cloud-scaling", "3", "3"],
                            ["security-reliability", "3", "2"],
                            ["ui-ux", "2", "3"],
                        ].map(([slug, col, row]) => (
                            <CapabilityCard
                                key={slug}
                                service={services.find((s) => s.slug === slug)}
                                sx={{ gridColumn: { lg: col }, gridRow: { lg: row } }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Outcomes band */}
            <Box sx={{
                background: "linear-gradient(180deg, #1b1722 0%, #17131d 100%)",
                color: "white",
                py: { xs: 7, lg: 10 },
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                <Box ref={outRef} className={outCls}>
                    <StatsTicker items={OUTCOMES} />
                </Box>
            </Box>

            {/* How it works */}
            <Box sx={{
                background: "linear-gradient(180deg, #17131d 0%, #14111b 100%)",
                color: "white",
                py: { xs: 8, lg: 13 },
            }}>
                <Box ref={stepRef} className={stepCls} sx={pageContainer}>
                    <Box sx={{ textAlign: "center", mb: { xs: 6, lg: 9 } }}>
                        <Typography sx={overline}>HOW IT WORKS</Typography>
                        <Typography sx={sectionTitle}>Three steps to a brighter app</Typography>
                    </Box>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                        gap: { xs: 3, lg: 4 },
                    }}>
                        {STEPS.map((st, i) => (
                            <StepCard key={st.title} step={st} index={i} />
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Our Clients */}
            <Box sx={{
                background: "linear-gradient(180deg, #14111b 0%, #0f0d14 100%)",
                color: "white",
                py: { xs: 8, lg: 13 },
            }}>
                <Box ref={cliRef} className={cliCls} sx={pageContainer}>
                    <Box sx={{ textAlign: "center", mb: { xs: 7, lg: 10 } }}>
                        <Typography sx={overline}>TRUSTED BY</Typography>
                        <Typography sx={sectionTitle}>Our Clients</Typography>
                    </Box>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                        gap: { xs: 4, md: 6 },
                        justifyItems: "center",
                        alignItems: "center",
                    }}>
                        <ClCards title={"RHP LTD"} img={"/images/rhpltd.jpg"} url={"https://www.rhpltd.net/"} />
                        <ClCards title={"Novartis"} img={"/images/Norvatis.png"} url={"https://www.novartis.com/"} />
                        <ClCards title={"Daiichi Sankyo"} img={"/images/Daiichi.png"} url={"https://www.daiichisankyo.com/"} />
                        <ClCards title={"Icheers"} img={"/images/iCheers.jpg"} url={"http://icheersinfo.com/en/index.html"} />
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}
