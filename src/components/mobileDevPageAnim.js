import React, { useState } from 'react';
import {Box, Typography} from "@mui/material";

export default function MobileDevPageAnim() {

    return (
        <Box>

            <Box className="hero">
                <Box className="hero__title" sx={{width:{xs:'90%', lg:'63%'}, fontSize:{xs:'9vw', sm:56, lg:72}}}>We Craft Native iOS and Android Apps</Box>
                <Box className="cube"></Box>
                <Box className="cube"></Box>
                <Box className="cube"></Box>
                <Box className="cube"></Box>
                <Box className="cube"></Box>
                <Box className="cube"></Box>
            </Box>

        </Box>
    );
}