import React, { useState } from 'react';
import {Box, Typography} from "@mui/material";

export default function WebDevPageAnim() {

    return (
        <Box sx={{position:'relative',}}>
            <Box className="hero__title" sx={{fontSize:{xs:54 ,sx:62 ,lg: 72}}}>We Create Amazing Web Apps</Box>
            <Box className="area">
                <ul className="gerd">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

            </Box>

        </Box>
    );
}