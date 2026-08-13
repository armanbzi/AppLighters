import MobileDevelopment from "/public/svg/MobileDevelopment.json";
import React, { useState } from 'react';
import {
    Link,
    Box,
    Typography
}
    from "@mui/material";
import NextLink from "next/link";

export default function MobileDev() {
    React.useEffect(() => {
        let anim;
        import("lottie-web").then(({ default: lottie }) => {
            anim = lottie.loadAnimation({
                container: document.querySelector("#MobileDevelopment"),
                animationData: MobileDevelopment,
                autoplay: isHover,
            });
        });
        return () => anim && anim.destroy();
    }, []);
    const [isHover, setIsHover] = useState('False');
    return (
        <Link sx={{textDecoration:'none'}} href={'/MobileDevPage'}>
        <Box
           onMouseEnter={()=>{setIsHover('True')}}
           onMouseLeave={()=>{setIsHover('False')}}
        >
            <Box id='MobileDevelopment'  sx={{width:{xs:120,sm:220,lg:260} ,height:  {xs:160,sm:220,lg:260},}}/>
            <Typography sx={isHover ==='True'? {
                marginTop:{xs:0,sm:0,lg:-1},marginLeft:{xs:0,sm:7,lg:4},
                    textAlign: 'center', fontSize:{xs:14,sm:20,lg:24} ,
                    lineHeight: 1.17, color: '#B33BFF',width:{xs:120,sm:120,lg:200}}:

                {marginLeft:{xs:0,sm:7,lg:4},
                    marginTop:{xs:0,sm:0,lg:-1},textAlign: 'center',
                    fontSize:{xs:14,sm:20,lg:24}, lineHeight: 1.17,
                    color: '#ffff',width:{xs:120,sm:120,lg:200}}}
            >Mobile <br/> Development</Typography>

        </Box>
        </Link>
    );
}