import createCache from '@emotion/cache';

// No insertionPoint on purpose. This app imports a global stylesheet
// (styles/_bgAnim.scss) whose classes (.ccl, .hero__title, …) are meant to be
// overridden by MUI `sx`. That only holds if Emotion's styles come AFTER the
// SCSS in the cascade. Anchoring Emotion to an early insertion point flipped
// that order and the SCSS started winning (the fire ring lost its centring and
// the dev-page headlines lost their responsive font sizes). Leaving Emotion at
// its default insertion keeps it last, so `sx` wins as before.
export default function createEmotionCache() {
  return createCache({ key: 'css' });
}
