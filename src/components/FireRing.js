import React, { useState } from 'react';
import {Box} from "@mui/material";

export default function FireRing() {
    return (
        <div>
            <Box className="ccl"
                 sx={{width:{xs:414,sm:500,lg:580},height:{xs:414,sm:500,lg:560}
                     ,
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     marginTop:{xs:-7,sm:5,lg:2}
            }}></Box>
            <svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}>
                <filter id="wavy" x="-50%" y="-50%" width="200%" height="200%"
                        colorInterpolationFilters="sRGB">
                    <feTurbulence type="fractalNoise" x="0" y="0" baseFrequency="0.009" numOctaves="5" seed="2" result="noise">
                        <animate attributeName="baseFrequency" dur="60s" values="0.02;0.005;0.02" repeatCount="indefinite"/>
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
            </svg>
        </div>

    );
}