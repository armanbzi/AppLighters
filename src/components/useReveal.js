import { useEffect, useRef, useState } from "react";

// Subtle on-scroll reveal. Deliberately fail-safe: content defaults to VISIBLE
// (SSR and first client render), so a hydration hiccup or missing
// IntersectionObserver can never leave a section stuck invisible — a real risk
// this codebase has hit before. We only hide-then-fade elements that are proven
// off-screen at mount, so the "hide" step is never seen. Honours reduced motion
// via the .reveal rules in styles/_bgAnim.scss.
//
// Usage:  const [ref, cls] = useReveal();  <Box ref={ref} className={cls} />
export default function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") return;

        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) return; // already on screen — leave it visible, no flash

        setVisible(false); // it's off-screen, so hiding it is invisible to the user
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    // Reveal when it scrolls into view, or when the observer's
                    // initial callback already finds it above the viewport (e.g.
                    // after a reload restores scroll position, or an in-page
                    // anchor jump) — otherwise those elements could stay hidden.
                    if (e.isIntersecting || e.boundingClientRect.top < 0) {
                        setVisible(true);
                        obs.disconnect();
                    }
                });
            },
            { threshold: 0, rootMargin: "0px 0px -8% 0px" }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return [ref, visible ? "reveal is-visible" : "reveal"];
}
