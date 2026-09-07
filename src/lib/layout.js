// One page container for the whole site, so the nav logo, section content and
// footer all line up on the same left/right edge at every width.
//
// Content edge = the gutter, at every width.
// Spread `pageContainer` onto the inner wrapper of any full-bleed section; give
// the outer section only its background and vertical padding.
//
// Blocks that are deliberately narrower (hero copy, intro paragraphs, stat
// rows) keep their own smaller `maxWidth` and stay centred inside this
// container — that reads as intentional rather than as misalignment.

// Fluid: the layout uses the full viewport with a fixed gutter rather than
// capping at a max width and centring. On a large display that keeps the logo
// and CTA close to the edges (the tight look we want) instead of drifting
// toward the middle. Deliberately narrow blocks below still cap themselves.
export const PAGE_PX = { xs: 3, sm: 4, lg: 5 }; // 24 / 32 / 40px gutters

export const pageContainer = {
    width: "100%",
    mx: "auto",
    px: PAGE_PX,
};

export default pageContainer;
