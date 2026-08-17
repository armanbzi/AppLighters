import React from 'react';
import { Box } from "@mui/material";

export default function AiDevPageAnim() {
    return (
        <>
            <Box className={"starsBg"}>
                <div id='stars'></div>
                <div id='stars2'></div>
                <div id='stars3'></div>
            </Box>

            <Box className="hero__title" sx={{width:'63%',fontSize:{xs:50 ,sm:62 ,lg: 72}}}>We Build Intelligent,
                AI-Powered Apps</Box>
        </>
    );
}
