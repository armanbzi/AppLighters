import {Box, Button, ClickAwayListener, Collapse, Container, IconButton, Link} from "@mui/material";
import NextLink from "next/link";
import {styled} from "@mui/system";
import {useContext, useState} from "react";
import { scroller } from "react-scroll";


let menus = [
    {
        title: "PORTFOLIO", url: "/Portfolio"
    },
    {
        title: "MOBILE", url: "/MobileDevPage"
    },
    {
        title: "WEB", url: "/WebDevPage"
    },
    {
        title: "AI INTEGRATED", url: "/AiDevPage"
    },
    {
        title: "BLOCKCHAIN", url: "/BlockDevPage"
    }
];

const Navigation = ({menu}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return <Box sx={{
        overflowX: 'hidden',
        position: "sticky",
        top: 0,
        transition: "top 300ms cubic-bezier(0.4, 0, 0.2, 1) 0m",
        zIndex: "1100",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "rgba(19, 17, 25, 0.35)",
    }}>
        <Container sx={{px: {sm: "30px", md: "20px"}, display: "flex", alignItems: "center", minHeight: 100}}>
            <NextLink href="/" passHref>
                <Box sx={{m: 0, mr: "20px", display: "inline-flex", alignItems: "center",
                    fontWeight: 800, fontSize: {xs: 21, sm: 25}, letterSpacing: "0.015em", lineHeight: 1,
                    transition: "opacity .2s ease", ":hover": {opacity: 0.85}}}>
                    <Box component="span" sx={{color: "#fff"}}>APP</Box>
                    <Box component="span" sx={{
                        ml: "3px",
                        background: "linear-gradient(135deg, #C98BFF 0%, #7E2BD8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>LIGHTERS</Box>
                </Box>
            </NextLink>
            <Box sx={{display: {xs: "none", md: "initial"},flex:1, alignItems:'center',justifyContent:'center'}}>
                <MenuBar>
                    <ul role="menubar">
                        {menus.map((m, idx) => <li key={`NAV__${idx}`} role="none">
                            <Link href={m.url} underline="none" sx={{color: "inherit"}}>
                                <Box sx={{
                                    display: "inline-block",
                                    backgroundColor: idx === menu ? "rgba(178,79,224,0.18)" : "transparent",
                                    textDecoration: "none",
                                    color: idx === menu ? '#fff' : 'rgba(255,255,255,0.72)',
                                    p: "9px 14px",
                                    mr: 0.5,
                                    borderRadius: "10px",
                                    transition: "color .2s ease, background-color .2s ease",
                                    ":hover": {
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                        color: "#fff"
                                    }
                                }}>{m.title}</Box>
                            </Link>
                        </li>)}
                    </ul>
                </MenuBar>
            </Box>
            <Box sx={{marginLeft: 'auto'}}/>
            <Button
                onClick={function  ()  {
                    scroller.scrollTo("Estimate", {
                        duration: 2000,
                        delay: 0,
                        smooth: "easeInOutQuart",
                    });
                }}
                variant="contained" size="large"
                sx={{width:{xs:100,sm:170,lg:210},
                    height:48, fontSize:13,
                    fontWeight: 'bold',
                    marginRight:{xs:1,sm:2,lg:0}}}>
                Request Estimate
            </Button>
            <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
                <Box sx={{display: {md: "none"}, mr: 1}}>
                    <IconButton
                        onClick={e => setIsMenuOpen(prevState => !prevState)}
                        sx={{
                            p: "6.5px",
                            borderRadius: "10px",
                            border: "1px solid",
                            backgroundColor: "transparent",
                            borderColor: "rgba(255,255,255,0.18)",
                            ":focus": {
                                boxShadow: "0 0 0 1px rgba(255,255,255,0.25)"
                            },
                            svg: {
                                width: "18px",
                                height: "18px",
                                verticalAlign: "bottom"
                            },
                            rect: !isMenuOpen ? {
                                transformOrigin: "center",
                                transition: "0.2s"
                            } : {
                                transformOrigin: "center",
                                transition: "all 0.2s ease 0s",
                                ":first-of-type": {
                                    transform: "translate(1.5px, 1.6px) rotateZ(-45deg)"
                                },
                                ":last-of-type": {
                                    transform: "translate(1.5px, -1.2px) rotateZ(45deg)"
                                }
                            }
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="5" width="14" height="1.5" rx="1" fill="#ffffff"/>
                            <rect x="1" y="9" width="14" height="1.5" rx="1" fill="#ffffff"/>
                        </svg>
                    </IconButton>
                    <Collapse in={isMenuOpen}
                              sx={{
                                  position: "fixed",
                                  top: 56,
                                  left: 0,
                                  right: 0,
                                  boxShadow: "rgb(0 0 0 / 35%) 0px 15px 20px -5px",
                                  backgroundColor: "rgba(20, 18, 27, 0.96)",
                                  backdropFilter: "blur(18px)",
                                  borderBottom: "1px solid rgba(255,255,255,0.08)"
                              }}>
                        <Box sx={{
                            p: "25px",
                            maxHeight: "calc(100vh - 56px)",
                            overflow: "auto"
                        }}>
                            <MobileMenu>
                                {menus.map((m, idx) => <li key={`MNAV__${idx}`}>
                                    <Link sx={{textDecoration: 'none'}} href={m.url}>
                                        <Box sx={{
                                            color: 'rgba(255,255,255,0.8)',
                                            textDecoration: 'none',
                                            p: "10px 6px",
                                            fontWeight: 600,
                                            letterSpacing: "0.04em",
                                            borderRadius: "8px",
                                            mb: 0.5,
                                            transition: "color .2s ease, background-color .2s ease",
                                            ":hover": {color: "#fff", backgroundColor: "rgba(255,255,255,0.06)"},
                                            backgroundColor: idx === menu ? "rgba(178,79,224,0.18)" : "transparent"
                                        }}>{m.title}</Box>
                                    </Link>
                                </li>)}
                            </MobileMenu>
                        </Box>
                    </Collapse>
                </Box>
            </ClickAwayListener>
        </Container></Box>;
};

export default Navigation;


const MenuBar = styled("nav")({
    ul: {
        padding: 0,
        margin: 0,
        listStyle: "none",
        display: "flex",
        flex:1, alignItems:'center',justifyContent:'center'
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


const MobileLink = styled("a")({
    fontSize: "0.875rem",
    lineHeight: 1.5,
    letterSpacing: 0,
    fontWeight: 700,
    textDecoration: "none",
    border: "none",
    width: "100%",
    backgroundColor: "transparent",
    color: "#46505A",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "10px",
    transition: "background 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    ":hover": {
        backgroundColor: "#EAEEF3"
    }
});