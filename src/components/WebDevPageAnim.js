import React, { useState } from 'react';
import {Box, Typography} from "@mui/material";

export default function WebDevPageAnim() {

    return (
        <>
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
            <Box className="hero__title" sx={{width:{xs:'90%', lg:'63%'}, fontSize:{xs:'11vw', sm:60, lg:72}}}>We Design Fast, Modern Web Apps</Box>
        </>
    );
}