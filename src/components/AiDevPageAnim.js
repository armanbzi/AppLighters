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

            {/* Hard breaks so the headline always reads as exactly three lines.
                "Intelligent, AI-" is the widest line, so below sm the size is fluid
                (11vw) and the box is wider — at a fixed 50px it wrapped into five
                lines on a phone. .hero__title is shared by the other dev pages, so
                both overrides stay inline here. */}
            <Box className="hero__title" sx={{width:{xs:'92%', lg:'63%'},fontSize:{xs:'11vw' ,sm:62 ,lg: 72}}}>We Build<br/>Intelligent, AI-<br/>Powered Apps</Box>
        </>
    );
}
