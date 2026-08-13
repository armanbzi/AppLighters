import lottie from "lottie-web";
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
        lottie.loadAnimation({
            container: document.querySelector("#BlockchainDev"),
            animationData: BlockchainDev,
            autoplay: isHover,
        });
    }, []);
    const [isHover, setIsHover] = useState('False');
    return (
        <NextLink href={'/BlockDevPage'} passHref>
        <Link href={'/BlockDevPage'} sx={{marginLeft: {xs:10,sm:40,lg:50},textDecoration:'none'}}
           onMouseEnter={()=>{setIsHover('True')}}
           onMouseLeave={()=>{setIsHover('False')}}
        >
            <Box id="BlockchainDev"  sx={{width: {xs:130,sm:180,lg:250},height: {xs:130,sm:180,lg:250},marginTop:{xs:4.5,sm:6,lg:0}}}/>
            <Box sx={isHover ==='True'? {marginTop:-0.8,textAlign: 'center', fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17, color: '#B33BFF',width:{xs:120,sm:175,lg:245}}:
                {marginTop:-0.8,textAlign: 'center', fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17, color: '#ffff',width:{xs:120,sm:175,lg:245}}}
            >Blockchain<br/>Development</Box>

        </Link>
        </NextLink>
    );
}