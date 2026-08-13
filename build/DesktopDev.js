import lottie from "lottie-web";
import DesktopDevelopment from '/public/svg/DesktopDevelopment.json';
import React, { useState } from 'react';
import {
    Link,
    Box
}
    from "@mui/material";
import NextLink from "next/link";

export default function DesktopDev() {
    React.useEffect(() => {
        lottie.loadAnimation({
            container: document.querySelector("#DesktopDevelopment"),
            animationData: DesktopDevelopment,
            autoplay: isHover,
        });
    }, []);
    const [isHover, setIsHover] = useState('False');
    return (
        <NextLink href={'/DesktopDevPage'} passHref>
        <Link href={'/DesktopDevPage'} sx={{marginLeft: {xs:10,sm:40,lg:50}, textDecoration:'none'}}
           onMouseEnter={()=>{setIsHover('True')}}
           onMouseLeave={()=>{setIsHover('False')}}
        ><br/><br/>
            <Box id="DesktopDevelopment"  sx={{width: {xs:150,sm:220,lg:230},height: {xs:165,sm:220,lg:250},}}/>
            <Box sx={isHover ==='True'? {marginTop:{xs:-3.7,sm:-3,lg:-3.7},textAlign: 'center', fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17, color: '#B33BFF',width:{xs:120,sm:180,lg:185}}:
                {marginTop:{xs:-3.7,sm:-3,lg:-3.7},textAlign: 'center', fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17, color: '#ffff',width:{xs:120,sm:180,lg:185}}}
            >Desktop<br/>Development</Box>

        </Link>
        </NextLink>
    );
}