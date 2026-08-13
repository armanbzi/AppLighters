import lottie from "lottie-web";
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
        lottie.loadAnimation({
            container: document.querySelector("#WebDevelopment"),
            animationData: WebDevelopment,
            autoplay: isHover,
        });
    }, []);
    const [isHover, setIsHover] = useState('False');
    return (
        <NextLink href={'/WebDevPage'} passHref>
        <Link href={'/WebDevPage'} sx={{marginLeft: {xs:30,sm:40,lg:50}, textDecoration:'none'}}
           onMouseEnter={()=>{setIsHover('True')}}
           onMouseLeave={()=>{setIsHover('False')}}
        >
            <Box id="WebDevelopment"  sx={{width: {xs:130,sm:180,lg:200},height: {xs:160,sm:220,lg:250},}}/>
            <Box sx={isHover ==='True'? {textAlign: 'center', fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17, color: '#B33BFF',}:
                {textAlign: 'center', fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17, color: '#ffff',}}
            >Web<br/>Development</Box>

        </Link>
        </NextLink>
    );
}