import Head from "next/head";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {CacheProvider} from "@emotion/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import theme from "../styles/theme";
import createEmotionCache from "../styles/createEmotionCache";
import {LoadingPage} from "../src/components/LoadingPage";
import anims from '/styles/_bgAnim.scss';


const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

    // Show the rocket lift-off loader during client-side route changes — the
    // per-page background animations (lottie / tsparticles) take a beat to mount.
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const start = () => setLoading(true);
        const stop = () => setLoading(false);
        router.events.on("routeChangeStart", start);
        router.events.on("routeChangeComplete", stop);
        router.events.on("routeChangeError", stop);
        return () => {
            router.events.off("routeChangeStart", start);
            router.events.off("routeChangeComplete", stop);
            router.events.off("routeChangeError", stop);
        };
    }, [router]);

    return (
            <CacheProvider value={emotionCache}>
                <Head>
                    <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png"/>
                    <link rel="shortcut icon" href="/favicon.ico"/>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                    <link rel="manifest" href="/site.webmanifest"/>
                    <meta name="theme-color" content="#B24FE0"/>
                    <title>AppLighters</title>
                    <meta name="viewport" content="initial-scale=1, width=device-width"/>
                </Head>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline/>
                            <LoadingPage isLoading={loading}/>
                            <Component {...pageProps} />
                </ThemeProvider>
            </CacheProvider>
    );
}