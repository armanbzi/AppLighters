import {Box, Button, ClickAwayListener, Collapse, Container, IconButton, Link} from "@mui/material";
import NextLink from "next/link";
import Logo from "../../public/images/Logo.svg";
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
        title: "DESKTOP", url: "/DesktopDevPage"
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
        backdropFilter: "blur(20px)",
        boxShadow: "inset 0px -1px 1px #eaeef3",
        backgroundColor: "rgba(255, 255, 255, 0.72)",
    }}>
        <Container sx={{px: {sm: "30px", md: "20px"}, display: "flex", alignItems: "center", minHeight: 100}}>
            <NextLink href="/" passHref>
                <Box sx={{m: 0, mr: "20px", lineHeight: 0, display: "inline-flex",width:200,height:100}}>
                    <Logo/>
                </Box>
            </NextLink>
            <Box sx={{display: {xs: "none", md: "initial"},flex:1, alignItems:'center',justifyContent:'center'}}>
                <MenuBar>
                    <ul role="menubar">
                        {menus.map((m, idx) => <li key={`NAV__${idx}`} role="none">
                            <Link href={m.url}>
                                <Box sx={{
                                    display: "inline-block",
                                    backgroundColor: idx === menu ? "#F3F6F9" : "transparent",
                                    textDecoration: "none",
                                    color: '#4b435a',
                                    p: "10px",
                                    mr: 1,
                                    borderRadius: "10px",
                                    ":hover": {
                                        backgroundColor: "#F3F6F9"
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
                            borderColor: "#E5E8EC",
                            ":focus": {
                                boxShadow: "0 0 0 1px #e5e8ec"
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
                            <rect x="1" y="5" width="14" height="1.5" rx="1" fill="#4529BA"/>
                            <rect x="1" y="9" width="14" height="1.5" rx="1" fill="#4529BA"/>
                        </svg>
                    </IconButton>
                    <Collapse in={isMenuOpen}
                              sx={{
                                  position: "fixed",
                                  top: 56,
                                  left: 0,
                                  right: 0,
                                  boxShadow: "rgb(90 105 120 / 10%) 0px 15px 10px -5px",
                                  backgroundColor: "rgb(255, 255, 255)"
                              }}>
                        <Box sx={{
                            p: "25px",
                            maxHeight: "calc(100vh - 56px)",
                            overflow: "auto"
                        }}>
                            <MobileMenu>
                                {menus.map((m, idx) => <li key={`MNAV__${idx}`}>
                                    <Link sx={{textDecoration: 'none',color: 'red',}} href={m.url}>
                                        <Box sx={{
                                            color: '#4b435a',
                                            textDecoration: 'none',
                                            mb: 1,
                                            backgroundColor: idx === menu ? "#F3F6F9" : "transparent"
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
        color: "#46505A",
        fontSize: "0.875rem",
        lineHeight: 1.5,
        letterSpacing: 0,
        fontWeight: 700
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