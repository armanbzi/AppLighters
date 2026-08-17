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
                     // The headline block is centred at 50%; this margin is exactly how
                     // far the ring's centre sits away from it. 0 centres the content in
                     // the ring on phone + tablet (was -7 / 5, which pushed it off).
                     marginTop:{xs:0,lg:2}
            }}></Box>
            <svg>
                <filter id="wavy">
                    <feTurbulence x="0" y="0" baseFrequency="0.009" numOctaves="5" seed="2">
                        <animate attributeName="baseFrequency" dur="60s" values="0.02;0.005;0.02" repeatCount="indefinite"/>
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="30"/>
                </filter>
            </svg>
        </div>

    );
}