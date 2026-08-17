import {createTheme, responsiveFontSizes} from "@mui/material/styles";

// Create a theme instance.
let theme = createTheme({
    palette: {
        primary: {main: "#B24FE0"},
        secondary: {main: "#413ED9", disable:"#E1E1FA"}, // #8d0083
        third: {main: "#E2FFFF"}, // #8d0083
        text: {primary: "rgb(19, 47, 76)", secondary: "rgb(32, 38, 45)", subtitle: "#AAAAAA"},
        background: {default: "#1F1F1F"}
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: [
            "\"IBM Plex Sans\"",
            "sans-serif"
        ].join(","),
        button: { textTransform: "none", fontWeight: 700 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: { scrollBehavior: "smooth" },
                body: { WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: "none",
                    fontWeight: 700,
                    transition: "transform .2s ease, box-shadow .2s ease, background .2s ease, filter .2s ease",
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #C15BEE 0%, #8A32E0 100%)",
                    boxShadow: "0 8px 22px rgba(178,79,224,0.28)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #C86BF2 0%, #9540E8 100%)",
                        boxShadow: "0 12px 30px rgba(178,79,224,0.45)",
                        transform: "translateY(-2px)",
                    },
                    "&:active": { transform: "translateY(0)" },
                },
            },
        },
    },
});
theme = responsiveFontSizes(theme);
export default theme;
