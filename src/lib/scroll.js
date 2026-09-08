// Smooth, tunable scroll to the contact form (footer, id="Estimate"). Extracted
// from Navigation so the nav CTA, the homepage hero and the service-page heroes
// all share one behaviour. We drive the scroll ourselves with requestAnimation-
// Frame + easing so the duration is tunable (native `behavior:'smooth'` is not),
// and temporarily disable the CSS `scroll-behavior:smooth` from theme.js so the
// browser doesn't re-smooth every per-frame scrollTo and fight our animation.
//
// The target id stays "Estimate" (the footer anchor in Layout.js) even though
// the button now reads "Boost My App" — keeping the id avoids touching markup
// that other things may reference.

const NAV_OFFSET = 90; // the sticky nav is ~100px tall
const SCROLL_DURATION = 1300; // ms — a deliberate, unhurried glide

export function scrollToEstimate() {
    if (typeof window === "undefined") return;
    const el = document.getElementById("Estimate");
    if (!el) return;

    const startY = window.pageYOffset;
    const targetY = el.getBoundingClientRect().top + startY - NAV_OFFSET;

    // Honour a reduced-motion preference: jump straight there.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo(0, targetY);
        return;
    }

    const distance = targetY - startY;
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    let startTime;
    const step = (now) => {
        if (startTime === undefined) startTime = now;
        const t = Math.min((now - startTime) / SCROLL_DURATION, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(t));
        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            html.style.scrollBehavior = prevBehavior; // restore CSS smooth scrolling
        }
    };
    requestAnimationFrame(step);
}

export default scrollToEstimate;
