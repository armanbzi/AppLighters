import Navigation from "./Navigation";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import NextLink from "next/link";
import LogoMark from "./LogoMark";
import Facebook from "../../public/icons/socials/facebook.svg";
import Instagram from "../../public/icons/socials/instagram.svg";
import Linkedin from "../../public/icons/socials/linkedin.svg";
import MailLink from "./MailLink";
import { useForm } from "react-hook-form";
import { init, sendForm } from "emailjs-com";

init("1ihU6hWB-uNhXs5cS");

const socials = [
    { Icon: Linkedin, href: "https://de.linkedin.com/in/arman-bazarchi-4395631a0" },
    { Icon: Instagram },
    { Icon: Facebook },
];

const navLinks = [
    { label: "Portfolio", href: "/Portfolio" },
    { label: "Mobile", href: "/MobileDevPage" },
    { label: "Web", href: "/WebDevPage" },
    { label: "AI Integrated", href: "/AiDevPage" },
    { label: "Blockchain", href: "/BlockDevPage" },
];

const labelSx = { display: "block", color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, mb: 0.75 };

const fieldSx = {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "10px",
    px: 1.75,
    py: 1.25,
    color: "#fff",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s ease, background-color .2s ease, box-shadow .2s ease",
    "&::placeholder": { color: "rgba(255,255,255,0.35)" },
    "&:hover": { borderColor: "rgba(201,139,255,0.45)" },
    "&:focus": {
        borderColor: "#C98BFF",
        backgroundColor: "rgba(201,139,255,0.07)",
        boxShadow: "0 0 0 3px rgba(201,139,255,0.12)",
    },
};

const socialSx = {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
    transition: "border-color .2s ease, background-color .2s ease, transform .2s ease",
    "&:hover": { borderColor: "#C98BFF", backgroundColor: "rgba(201,139,255,0.12)", transform: "translateY(-2px)" },
    "& svg": { width: 18, height: 18 },
};

const sectionLabelSx = {
    color: "#C98BFF",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    mb: 1.25,
};

const footerNavSx = {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    textDecoration: "none",
    cursor: "pointer",
    transition: "color .2s ease",
    "&:hover": { color: "#C98BFF" },
};

export default function Layout({ children, menu, footerCoversBg }) {
    const { handleSubmit } = useForm();

    const onSubmit = () => {
        sendForm("service_cmwxcj9", "template_mxlgvo5", "#contact-form").then(
            function (response) {
                console.log("SUCCESS!", response.status, response.text);
                alert("Thanks, we will response shortly :)");
                location.reload();
            },
            function (error) {
                console.log("FAILED...", error);
                alert("Please try again!");
                location.reload();
            }
        );
    };

    return (
        <Box sx={{ position: "relative" }}>
            <Navigation menu={menu} />
            {children}

            <Box
                component="footer"
                sx={{
                    // WebDevPage opts in (footerCoversBg) so its large squares stay in the hero.
                    // Default (AI/Blockchain/Mobile): footer sits below the fixed animation
                    // so stars/particles/cubes keep running through the footer as before.
                    ...(footerCoversBg ? { position: "relative", zIndex: 2 } : {}),
                    backgroundColor: "#17151d",
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                    color: "#fff",
                    px: { xs: 3, sm: 6, lg: 8 },
                    pt: { xs: 6, md: 9 },
                    pb: { xs: 4, md: 5 },
                }}
            >
                <Box id="Estimate" sx={{ maxWidth: 1180, mx: "auto" }}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" },
                                gap: { xs: 6, md: 10 },
                                alignItems: "start",
                            }}
                        >
                            {/* Estimate form */}
                            <Box>
                                <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 32 }, lineHeight: 1.15, mb: 1 }}>
                                    Request an Estimate
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: { xs: 14, md: 15 }, lineHeight: 1.6, mb: 3.5, maxWidth: 460 }}>
                                    Tell us about your project and we&apos;ll get back to you within one business day.
                                </Typography>

                                <Box component="form" id="contact-form" onSubmit={handleSubmit(onSubmit)} method="post">
                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2 }}>
                                        <Box>
                                            <Typography component="label" htmlFor="user_name" sx={labelSx}>Name</Typography>
                                            <Box component="input" type="text" id="user_name" name="user_name" required placeholder="Your name" sx={fieldSx} />
                                        </Box>
                                        <Box>
                                            <Typography component="label" htmlFor="user_email" sx={labelSx}>Email</Typography>
                                            <Box component="input" type="email" id="user_email" name="user_email" required placeholder="you@company.com" sx={fieldSx} />
                                        </Box>
                                    </Box>
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography component="label" htmlFor="message" sx={labelSx}>Project detail</Typography>
                                        <Box
                                            component="textarea"
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            placeholder="Tell us what you're building..."
                                            sx={{ ...fieldSx, resize: "vertical", minHeight: 120, lineHeight: 1.6 }}
                                        />
                                    </Box>
                                    <Button type="submit" variant="contained" size="large" sx={{ px: 4, py: 1.25, fontWeight: 700 }}>
                                        Send Request
                                    </Button>
                                </Box>
                            </Box>

                            {/* Brand + contact */}
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
                                    <LogoMark height={52} glow animated />
                                    <Typography sx={{ fontWeight: 800, fontSize: 24, letterSpacing: "0.01em", lineHeight: 1 }}>
                                        <Box component="span" sx={{ color: "#fff" }}>APP</Box>
                                        <Box
                                            component="span"
                                            sx={{
                                                ml: "3px",
                                                background: "linear-gradient(135deg, #C98BFF 0%, #7E2BD8 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                            }}
                                        >
                                            LIGHTERS
                                        </Box>
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14.5, lineHeight: 1.7, mb: 4, maxWidth: 340 }}>
                                    We craft superior web, mobile, AI-integrated and blockchain applications that deliver real results.
                                </Typography>

                                <Typography sx={sectionLabelSx}>Get in touch</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
                                    <EmailRoundedIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.55)" }} />
                                    <MailLink />
                                </Box>

                                <Typography sx={sectionLabelSx}>Follow us</Typography>
                                <Stack direction="row" spacing={1.5}>
                                    {socials.map((s, i) => {
                                        const Icon = s.Icon;
                                        const linkProps = s.href
                                            ? { component: Link, href: s.href, target: "_blank", rel: "noopener noreferrer" }
                                            : {};
                                        return (
                                            <Box key={i} {...linkProps} sx={socialSx}>
                                                <Icon />
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        </Box>

                        {/* Bottom bar */}
                        <Box
                            sx={{
                                mt: { xs: 5, md: 7 },
                                pt: 3,
                                borderTop: "1px solid rgba(255,255,255,0.07)",
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                justifyContent: "space-between",
                                gap: 2,
                            }}
                        >
                            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
                                © {new Date().getFullYear()} AppLighters. All rights reserved.
                            </Typography>
                            <Stack direction="row" spacing={{ xs: 2, sm: 3 }} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                                {navLinks.map((l) => (
                                    <Link key={l.href} component={NextLink} href={l.href} sx={footerNavSx}>
                                        {l.label}
                                    </Link>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
            </Box>
        </Box>
    );
}
