import { Box, Button, ClickAwayListener, Collapse, IconButton, Link } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { styled } from "@mui/system";
import { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LogoMark from "./LogoMark";
import { scrollToEstimate } from "../lib/scroll";
import { pageContainer } from "../lib/layout";
import { services } from "../data/services";

const Navigation = () => {
    const router = useRouter();
    const asPath = router.asPath || "/";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    const onServices = asPath.startsWith("/services");
    const onWork = asPath.startsWith("/Portfolio");
    const isActiveService = (slug) => asPath === `/services/${slug}`;

    return (
        <Box sx={{
            position: "sticky",
            top: 0,
            transition: "top 300ms cubic-bezier(0.4, 0, 0.2, 1) 0m",
            zIndex: "1100",
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(19, 17, 25, 0.35)",
        }}>
            <Box sx={{ ...pageContainer, display: "flex", alignItems: "center", minHeight: 100 }}>
                <NextLink href="/" passHref>
                    <Box sx={{
                        // Optical alignment: LogoMark's viewBox ("-2 -3 124 166") is padded
                        // so the tilted rocket never clips, which leaves ~0.15×height of
                        // transparent space on its left. Without this pull the glyph reads
                        // ~7px further in than the CTA's solid edge, even though the boxes
                        // are symmetric. Scales with the 46px nav logo.
                        m: 0, ml: "-7px", mr: "20px", display: "inline-flex", alignItems: "center",
                        fontWeight: 800, fontSize: { xs: 21, sm: 25 }, letterSpacing: "0.015em", lineHeight: 1,
                        transition: "opacity .2s ease", ":hover": { opacity: 0.85 }
                    }}>
                        <LogoMark height={46} glow animated style={{ marginRight: 3 }} />
                        <Box component="span" sx={{ color: "#fff" }}>APP</Box>
                        <Box component="span" sx={{
                            ml: "3px",
                            background: "linear-gradient(135deg, #C98BFF 0%, #7E2BD8 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>LIGHTERS</Box>
                    </Box>
                </NextLink>

                {/* Desktop menu */}
                <Box sx={{ display: { xs: "none", md: "flex" }, flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <MenuBar>
                        <ul role="menubar">
                            {/* Services dropdown */}
                            <li
                                role="none"
                                style={{ position: "relative" }}
                                onMouseEnter={() => setServicesOpen(true)}
                                onMouseLeave={() => setServicesOpen(false)}
                            >
                                <Box
                                    role="menuitem"
                                    aria-haspopup="true"
                                    aria-expanded={servicesOpen}
                                    tabIndex={0}
                                    onClick={() => setServicesOpen((v) => !v)}
                                    onFocus={() => setServicesOpen(true)}
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "2px",
                                        cursor: "pointer",
                                        backgroundColor: onServices ? "rgba(178,79,224,0.18)" : "transparent",
                                        color: onServices ? "#fff" : "rgba(255,255,255,0.72)",
                                        p: "9px 12px",
                                        mr: 0.5,
                                        borderRadius: "10px",
                                        transition: "color .2s ease, background-color .2s ease",
                                        ":hover": { backgroundColor: "rgba(255,255,255,0.08)", color: "#fff" },
                                    }}
                                >
                                    SERVICES
                                    <KeyboardArrowDownRoundedIcon
                                        sx={{ fontSize: 18, transition: "transform .2s ease", transform: servicesOpen ? "rotate(180deg)" : "none" }}
                                    />
                                </Box>

                                {/* Dropdown panel */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "calc(100% + 10px)",
                                        left: "50%",
                                        transform: servicesOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-8px)",
                                        width: 340,
                                        p: 1,
                                        borderRadius: "16px",
                                        backgroundColor: "rgba(20, 18, 27, 0.97)",
                                        backdropFilter: "blur(18px)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.6)",
                                        opacity: servicesOpen ? 1 : 0,
                                        visibility: servicesOpen ? "visible" : "hidden",
                                        transition: "opacity .2s ease, transform .2s ease, visibility .2s",
                                        zIndex: 1200,
                                    }}
                                >
                                    {services.map((s) => {
                                        const Icon = s.icon;
                                        const active = isActiveService(s.slug);
                                        return (
                                            <Link
                                                key={s.slug}
                                                component={NextLink}
                                                href={`/services/${s.slug}`}
                                                underline="none"
                                                onClick={() => setServicesOpen(false)}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    p: "10px 12px",
                                                    borderRadius: "10px",
                                                    backgroundColor: active ? "rgba(178,79,224,0.16)" : "transparent",
                                                    transition: "background-color .18s ease",
                                                    ":hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                                                }}
                                            >
                                                <Box sx={{
                                                    width: 34, height: 34, borderRadius: "9px", flexShrink: 0,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: "#C98BFF", bgcolor: "rgba(178,79,224,0.14)",
                                                }}>
                                                    {Icon ? <Icon sx={{ fontSize: 19 }} /> : null}
                                                </Box>
                                                <Box>
                                                    <Box sx={{ color: "#fff", fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{s.name}</Box>
                                                    <Box sx={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.35, mt: "1px" }}>{s.tagline}</Box>
                                                </Box>
                                            </Link>
                                        );
                                    })}
                                </Box>
                            </li>

                            {/* Work */}
                            <li role="none">
                                <Link component={NextLink} href="/Portfolio" underline="none" sx={{ color: "inherit" }}>
                                    <Box sx={{
                                        display: "inline-block",
                                        backgroundColor: onWork ? "rgba(178,79,224,0.18)" : "transparent",
                                        color: onWork ? "#fff" : "rgba(255,255,255,0.72)",
                                        p: "9px 14px",
                                        borderRadius: "10px",
                                        transition: "color .2s ease, background-color .2s ease",
                                        ":hover": { backgroundColor: "rgba(255,255,255,0.08)", color: "#fff" },
                                    }}>WORK</Box>
                                </Link>
                            </li>
                        </ul>
                    </MenuBar>
                </Box>

                <Box sx={{ marginLeft: "auto" }} />
                <Button
                    onClick={scrollToEstimate}
                    variant="contained" size="large"
                    sx={{
                        width: { xs: 150, sm: 170, lg: 190 },
                        height: 48, fontSize: 13, fontWeight: "bold", whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}>
                    Boost My App
                </Button>

                {/* Mobile menu */}
                <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
                    <Box sx={{ display: { md: "none" }, ml: 1.5 }}>
                        <IconButton
                            onClick={() => setIsMenuOpen((prevState) => !prevState)}
                            sx={{
                                p: "6.5px",
                                borderRadius: "10px",
                                border: "1px solid",
                                backgroundColor: "transparent",
                                borderColor: "rgba(255,255,255,0.18)",
                                ":focus": { boxShadow: "0 0 0 1px rgba(255,255,255,0.25)" },
                                svg: { width: "18px", height: "18px", verticalAlign: "bottom" },
                                rect: !isMenuOpen ? {
                                    transformOrigin: "center", transition: "0.2s"
                                } : {
                                    transformOrigin: "center", transition: "all 0.2s ease 0s",
                                    ":first-of-type": { transform: "translate(1.5px, 1.6px) rotateZ(-45deg)" },
                                    ":last-of-type": { transform: "translate(1.5px, -1.2px) rotateZ(45deg)" }
                                }
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                                <rect x="1" y="5" width="14" height="1.5" rx="1" fill="#ffffff" />
                                <rect x="1" y="9" width="14" height="1.5" rx="1" fill="#ffffff" />
                            </svg>
                        </IconButton>
                        <Collapse in={isMenuOpen}
                            sx={{
                                position: "fixed",
                                top: 100,
                                left: 0,
                                right: 0,
                                boxShadow: "rgb(0 0 0 / 35%) 0px 15px 20px -5px",
                                backgroundColor: "rgba(20, 18, 27, 0.96)",
                                backdropFilter: "blur(18px)",
                                borderBottom: "1px solid rgba(255,255,255,0.08)"
                            }}>
                            <Box sx={{ p: "20px 25px", maxHeight: "calc(100vh - 100px)", overflow: "auto" }}>
                                <Box sx={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", mb: 1, px: "6px" }}>
                                    SERVICES
                                </Box>
                                <MobileMenu>
                                    {services.map((s) => {
                                        const Icon = s.icon;
                                        return (
                                            <li key={s.slug}>
                                                <Link component={NextLink} href={`/services/${s.slug}`} underline="none"
                                                    onClick={() => setIsMenuOpen(false)}>
                                                    <Box sx={{
                                                        display: "flex", alignItems: "center", gap: 1.25,
                                                        color: isActiveService(s.slug) ? "#fff" : "rgba(255,255,255,0.8)",
                                                        p: "10px 6px", fontWeight: 600, borderRadius: "8px", mb: 0.25,
                                                        backgroundColor: isActiveService(s.slug) ? "rgba(178,79,224,0.18)" : "transparent",
                                                        transition: "color .2s ease, background-color .2s ease",
                                                        ":hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.06)" },
                                                    }}>
                                                        <Box sx={{ color: "#C98BFF", display: "flex" }}>{Icon ? <Icon sx={{ fontSize: 20 }} /> : null}</Box>
                                                        {s.name}
                                                    </Box>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                    <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.08)", my: 1 }} />
                                    <li>
                                        <Link component={NextLink} href="/Portfolio" underline="none" onClick={() => setIsMenuOpen(false)}>
                                            <Box sx={{
                                                color: onWork ? "#fff" : "rgba(255,255,255,0.8)",
                                                p: "10px 6px", fontWeight: 600, letterSpacing: "0.04em", borderRadius: "8px",
                                                backgroundColor: onWork ? "rgba(178,79,224,0.18)" : "transparent",
                                                transition: "color .2s ease, background-color .2s ease",
                                                ":hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.06)" },
                                            }}>WORK</Box>
                                        </Link>
                                    </li>
                                </MobileMenu>
                            </Box>
                        </Collapse>
                    </Box>
                </ClickAwayListener>
            </Box>
        </Box>
    );
};

export default Navigation;

const MenuBar = styled("nav")({
    ul: {
        padding: 0,
        margin: 0,
        listStyle: "none",
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    li: {
        color: "rgba(255,255,255,0.72)",
        fontSize: "0.875rem",
        lineHeight: 1.5,
        letterSpacing: "0.04em",
        fontWeight: 600
    }
});

const MobileMenu = styled("ul")({
    padding: 0,
    margin: 0,
    listStyleType: "none"
});
