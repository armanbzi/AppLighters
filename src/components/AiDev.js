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
        let cancelled = false;
        import("lottie-web").then(({ default: lottie }) => {
            // Under React 18 StrictMode the effect mounts, cleans up, then
            // mounts again — all before this async import resolves. Without the
            // guard the first run's animation is created after its cleanup ran,
            // leaving an orphaned second SVG in the container.
            if (cancelled) return;
            const container = document.querySelector("#DesktopDevelopment");
            if (!container) return;
            container.innerHTML = "";
            anim = lottie.loadAnimation({
                container,
                animationData: DesktopDevelopment,
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