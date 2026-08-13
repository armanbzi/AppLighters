import React, { useState } from 'react';
import {Box, Typography} from "@mui/material";

export default function MobileDevPageAnim() {

    return (
        <Box>

            <Box className="hero">
                <Box className="hero__title" sx={{fontSize:{xs:50 ,sx:62 ,lg: 72}}}>We Develop Amazing iOS and Android Apps</Box>
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