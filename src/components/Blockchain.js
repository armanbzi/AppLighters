import BlockchainDev from "/public/svg/BlockchainDev.json";
import React, { useState } from 'react';
import {
    Link,
    Box
}
    from "@mui/material";
import NextLink from "next/link";

export default function Blockchain() {
    React.useEffect(() => {
        let anim;
        let cancelled = false;
        import("lottie-web").then(({ default: lottie }) => {
            // See AiDev.js — StrictMode-safe guard against an orphaned second SVG.
            if (cancelled) return;
            const container = document.querySelector("#BlockchainDev");
            if (!container) return;
            container.innerHTML = "";
            anim = lottie.loadAnimation({
                container,
                animationData: BlockchainDev,
                autoplay: true,
            });
        });
        return () => {
            cancelled = true;
            if (anim) anim.destroy();
        };
    }, []);
    const [isHover, setIsHover] = useState('False');
    return (
        <Link sx={{textDecoration:'none'}} href={'/BlockDevPage'}>
        <Box
           onMouseEnter={()=>{setIsHover('True')}}
           onMouseLeave={()=>{setIsHover('False')}}
        >
            <Box id="BlockchainDev"  sx={{width: {xs:80,sm:180,lg:250},height: {xs:130,sm:180,lg:250},marginTop:{xs:4.5,sm:6,lg:0}}}/>
            <Box sx={isHover ==='True'? {marginTop:-0.8,textAlign: 'center',
                    fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17,
                    color: '#B33BFF',width:{xs:80,sm:175,lg:245}}:

                {marginTop:-0.8,textAlign: 'center', fontSize: {xs:14,sm:20,lg:24},
                    lineHeight: 1.17, color: '#ffff',width:{xs:80,sm:175,lg:245}}}
            >Blockchain<br/>Development</Box>

        </Box>
        </Link>
    );
}