import {createTheme, responsiveFontSizes} from "@mui/material/styles";

// Create a theme instance.
let theme = createTheme({
    palette: {
        primary: {main: "#B24FE0"},
        secondary: {main: "#413ED9", disable:"#E1E1FA"}, // #8d0083
        third: {main: "#E2FFFF"}, // #8d0083
        text: {primary: "rgb(19, 47, 76)", secondary: "rgb(32, 38, 45)", subtitle: "#AAAAAA"},
        background: {default: "rgb(70 40 186 / 2%)"}
    },
    typography: {
        fontFamily: [
            "\"IBM Plex Sans\"",
            "sans-serif"
        ].join(",")
    }
});
theme = responsiveFontSizes(theme);
export default theme;