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

            {/* Hard breaks keep the headline to two balanced lines. Each line is
                shorter than the old widest line ("Intelligent, AI-"), so the fluid
                mobile size (11vw) and the inline width/size overrides below still
                hold. .hero__title is shared by the other dev pages, so both
                overrides stay inline here. */}
            <Box className="hero__title" sx={{width:{xs:'92%', lg:'63%'},fontSize:{xs:'11vw' ,sm:62 ,lg: 72}}}>We Engineer AI<br/>Into Every App</Box>
        </>
    );
}
