import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "../styles/createEmotionCache";

// Emotion SSR for the pages router. Without this, MUI's Emotion styles are
// injected on the client only, so every fresh load flashes unstyled (FOUC).
// getInitialProps below renders the app with a server cache, extracts the
// critical CSS, and inlines it into <Head> so the first paint is styled.
export default function MyDocument({ emotionStyleTags }) {
    return (
        <Html lang="en">
            <Head>{emotionStyleTags}</Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

MyDocument.getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage;

    // A fresh cache per request — a shared module-level cache would leak
    // styles between concurrent SSR renders.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) =>
                function EnhanceApp(props) {
                    return <App emotionCache={cache} {...props} />;
                },
        });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(" ")}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        emotionStyleTags,
    };
};
