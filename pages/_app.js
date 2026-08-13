import Head from "next/head";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {CacheProvider} from "@emotion/react";
import theme from "../styles/theme";
import createEmotionCache from "../styles/createEmotionCache";
import anims from '/styles/_bgAnim.scss';


const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

    return (
            <CacheProvider value={emotionCache}>
                <Head>
                    <link rel="icon" href="/images/APP_Lighters-Icon.png" sizes= '180x180'/>
                    <title>AppLighters</title>
                    <meta name="viewport" content="initial-scale=1, width=device-width"/>
                </Head>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline/>
                            <Component {...pageProps} />
                </ThemeProvider>
            </CacheProvider>
    );
}