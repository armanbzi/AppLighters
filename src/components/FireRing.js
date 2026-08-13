import React from 'react';
import {Box} from "@mui/material";

export default function FireRing() {
    return (
        <div>
            <Box className="ccl"
                 sx={{width:{xs:414,sm:500,lg:580},height:{xs:414,sm:500,lg:560},
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     marginTop:{xs:-7,sm:5,lg:2}
            }}>
                <span className="smoke smoke-1"/>
                <span className="smoke smoke-2"/>
                <span className="smoke smoke-3"/>
            </Box>
        </div>
    );
}
