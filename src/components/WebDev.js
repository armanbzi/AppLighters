import WebDevelopment from '/public/svg/WebDevelopment.json';
import React, { useState } from 'react';
import {
    Link,
    Box
}
    from "@mui/material";
import NextLink from "next/link";

export default function WebDev() {
    React.useEffect(() => {
        let anim;
        import("lottie-web").then(({ default: lottie }) => {
            anim = lottie.loadAnimation({
                container: document.querySelector("#WebDevelopment"),
                animationData: WebDevelopment,
                autoplay: isHover,
            });
        });
        return () => anim && anim.destroy();
    }, []);
    const [isHover, setIsHover] = useState('False');
    return (
        <Link sx={{ textDecoration:'none'}} href={'/WebDevPage'}>
        <Box
           onMouseEnter={()=>{setIsHover('True')}}
           onMouseLeave={()=>{setIsHover('False')}}
        >
            <Box id="WebDevelopment"  sx={{width: {xs:100,sm:180,lg:200},height: {xs:160,sm:220,lg:250},}}/>
            <Box sx={isHover ==='True'? {textAlign: 'center', fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17, color: '#B33BFF',}:
                {textAlign: 'center', fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17, color: '#ffff',}}
            >Web<br/>Development</Box>

        </Box>
        </Link>
    );
}