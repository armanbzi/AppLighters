import React, { useState } from 'react';
import {Box, Typography} from "@mui/material";

export default function DesktopDevPageAnim() {

    return (
        <Box className={"deskBg"} sx={{position:'relative',}}>
            <div id='stars'></div>
            <div id='stars2'></div>
            <div id='stars3'></div>

            <Box className="hero__title" sx={{width:'63%',fontSize:{xs:50 ,sx:62 ,lg: 72}}}>We create superior
                Windows and OS X apps</Box>

        </Box>
    );
}