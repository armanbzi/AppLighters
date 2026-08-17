import DesktopDevelopment from '/public/svg/DesktopDevelopment.json';
import React, { useState } from 'react';
import {
    Link,
    Box
}
    from "@mui/material";

export default function AiDev() {
    React.useEffect(() => {
        let anim;
        import("lottie-web").then(({ default: lottie }) => {
            anim = lottie.loadAnimation({
                container: document.querySelector("#DesktopDevelopment"),
                animationData: DesktopDevelopment,
                autoplay: isHover,
            });
        });
        return () => anim && anim.destroy();
    }, []);
    const [isHover, setIsHover] = useState('False');
    return (
        <Link sx={{ textDecoration:'none'}} href={'/AiDevPage'}>
        <Box
           onMouseEnter={()=>{setIsHover('True')}}
           onMouseLeave={()=>{setIsHover('False')}}
        ><br/><br/>
            <Box id="DesktopDevelopment"  sx={{width: {xs:110,sm:220,lg:230},height: {xs:165,sm:220,lg:250},}}/>
            <Box sx={isHover ==='True'? {
                marginTop:{xs:-6,sm:-3,lg:-3.7},textAlign: 'center',
                    fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17,
                    color: '#B33BFF',width:{xs:130,sm:180,lg:185}}:

                {marginTop:{xs:-6,sm:-3,lg:-3.7},textAlign: 'center',
                    fontSize: {xs:14,sm:20,lg:24}, lineHeight: 1.17,
                    color: '#ffff',width:{xs:130,sm:180,lg:185}}}
            >AI<br/>Integrated</Box>

        </Box>
        </Link>
    );
}