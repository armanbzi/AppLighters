import React from "react";
import {Box} from "@mui/system";
import {CircularProgress, Fade} from "@mui/material";

export const LoadingPage = ({isLoading}) => (
    <Fade in={isLoading}>
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1120,
                backgroundColor: "rgba(32, 38, 45, 0.2)",
                backdropFilter: "blur(2px)"
            }}
        >
            <Box sx={{position: "relative"}}>
                <CircularProgress
                    variant="determinate"
                    sx={{
                        color: (theme) =>
                            theme.palette.secondary.main
                    }}
                    size={40}
                    thickness={4}
                    value={100}
                />
                <CircularProgress
                    variant="indeterminate"
                    disableShrink
                    sx={{
                        animationDuration: "550ms",
                        position: "absolute",
                        left: 0
                    }}
                    size={40}
                    thickness={4}
                />
            </Box>
        </Box>
    </Fade>
);