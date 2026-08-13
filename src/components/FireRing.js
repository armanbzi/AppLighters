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