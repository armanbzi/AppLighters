import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// On the client, anchor Emotion's insertion to the <meta> that _document.js
// renders, so client-inserted styles land in the same place as the SSR ones
// and the cascade matches between server and client (no hydration reshuffle).
export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]',
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: 'css', insertionPoint });
}
