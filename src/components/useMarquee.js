import { useEffect } from "react";

// Shared right-to-left marquee physics, used by the hero apps chain and the
// outcomes band.
//
// One rAF loop advances `offset` by (drift + vel). Grabbing pins the track to
// the pointer; releasing hands over the pointer's recent velocity as `vel`,
// which then decays exponentially — a flick shoots the row and it coasts back
// to the resting drift. The track renders its children `copies` times and
// `offset` wraps at one set's width, so the loop is seamless either way.
//
// `draggedRef` (optional) is set true once a gesture travels past CLICK_SLOP so
// the caller can suppress the click and not open a link after a drag.

const FRICTION = 1.9;
const MAX_FLICK = 2600;
const CLICK_SLOP = 6;

export default function useMarquee({ wrapRef, trackRef, copies = 3, drift = 38, draggable = true, draggedRef }) {
    useEffect(() => {
        const wrap = wrapRef.current, track = trackRef.current;
        if (!wrap || !track || typeof window === "undefined") return;
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let raf = 0, running = true, last = 0;
        let offset = 0, vel = 0, setW = 1;
        let dragging = false, startX = 0, startOffset = 0, moved = 0;
        let lastX = 0, lastT = 0, sampleV = 0;

        const measure = () => { setW = Math.max(1, track.scrollWidth / copies); };
        const apply = () => {
            offset = ((offset % setW) + setW) % setW;
            track.style.transform = `translate3d(${-offset}px,0,0)`;
        };

        const frame = (now) => {
            const s = now / 1000;
            const dt = Math.min(0.05, Math.max(0.001, s - (last || s)));
            last = s;
            if (!dragging) {
                offset += (drift + vel) * dt;
                vel -= vel * Math.min(1, FRICTION * dt);
                if (Math.abs(vel) < 1) vel = 0;
                apply();
            }
            if (running && !reduce) raf = requestAnimationFrame(frame);
        };
        const start = () => { if (raf) cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); };

        const onDown = (e) => {
            dragging = true;
            if (draggedRef) draggedRef.current = false;
            moved = 0;
            startX = lastX = e.clientX;
            startOffset = offset;
            lastT = performance.now();
            sampleV = 0;
            vel = 0;
            wrap.setPointerCapture?.(e.pointerId);
            wrap.style.cursor = "grabbing";
        };
        const onMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            moved = Math.max(moved, Math.abs(dx));
            if (moved > CLICK_SLOP && draggedRef) draggedRef.current = true;
            offset = startOffset - dx;
            apply();
            const now = performance.now();
            const dt = (now - lastT) / 1000;
            if (dt > 0.004) { sampleV = (e.clientX - lastX) / dt; lastX = e.clientX; lastT = now; }
        };
        const onUp = (e) => {
            if (!dragging) return;
            dragging = false;
            wrap.style.cursor = "grab";
            wrap.releasePointerCapture?.(e.pointerId);
            const idle = performance.now() - lastT > 120; // released after pausing = no throw
            vel = idle ? 0 : Math.max(-MAX_FLICK, Math.min(MAX_FLICK, -sampleV));
        };

        measure();
        apply();
        if (!reduce) start();

        if (draggable) {
            wrap.addEventListener("pointerdown", onDown);
            wrap.addEventListener("pointermove", onMove);
            wrap.addEventListener("pointerup", onUp);
            wrap.addEventListener("pointercancel", onUp);
        }

        let io;
        if (!reduce && typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver((es) => es.forEach((en) => {
                running = en.isIntersecting;
                if (running) start(); else if (raf) cancelAnimationFrame(raf);
            }));
            io.observe(wrap);
        }
        let ro;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => { measure(); apply(); });
            ro.observe(track);
        }
        const onImg = () => measure();
        const imgs = track.querySelectorAll("img");
        imgs.forEach((im) => im.addEventListener("load", onImg));

        return () => {
            if (draggable) {
                wrap.removeEventListener("pointerdown", onDown);
                wrap.removeEventListener("pointermove", onMove);
                wrap.removeEventListener("pointerup", onUp);
                wrap.removeEventListener("pointercancel", onUp);
            }
            imgs.forEach((im) => im.removeEventListener("load", onImg));
            if (io) io.disconnect();
            if (ro) ro.disconnect();
            if (raf) cancelAnimationFrame(raf);
        };
    }, [wrapRef, trackRef, copies, drift, draggable, draggedRef]);
}
