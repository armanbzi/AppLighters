import { useEffect, useRef } from "react";
import { watchLoop } from "../lib/motion.mjs";

// Shared right-to-left marquee physics, used by the hero apps chain and the
// outcomes band.
//
// One loop on the shared motion clock (src/lib/motion.mjs) advances `offset` by (drift + vel). Grabbing pins the track to
// the pointer; releasing hands over the pointer's recent velocity as `vel`,
// which then decays exponentially — a flick shoots the row and it coasts back
// to the resting drift. The track renders its children `copies` times and
// `offset` wraps at one set's width, so the loop is seamless either way.
//
// `draggedRef` (optional) is set true once a gesture travels past CLICK_SLOP so
// the caller can suppress the click and not open a link after a drag.
//
// `onTap` (optional) fires with the `<a href>` under the press when a gesture is
// a genuine tap (no travel). The row drifts continuously and the wrapper takes
// pointer capture, so the browser's native `click` lands on the wrapper, not the
// moving tile — we resolve the target at pointerdown and open it ourselves.

const FRICTION = 1.9;
const MAX_FLICK = 2600;
const CLICK_SLOP = 6;

export default function useMarquee({ wrapRef, trackRef, copies = 3, drift = 38, draggable = true, draggedRef, onTap }) {
    const onTapRef = useRef(onTap);
    onTapRef.current = onTap; // read live in the pointer handlers without re-running the effect
    useEffect(() => {
        const wrap = wrapRef.current, track = trackRef.current;
        if (!wrap || !track || typeof window === "undefined") return;
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let last = 0;
        let offset = 0, vel = 0, setW = 1;
        let dragging = false, startX = 0, startOffset = 0, moved = 0;
        let downAnchor = null, downTime = 0;
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
        };

        const onDown = (e) => {
            dragging = true;
            if (draggedRef) draggedRef.current = false;
            moved = 0;
            downAnchor = (e.target && e.target.closest) ? e.target.closest("a[href]") : null;
            downTime = performance.now();
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
            // a quick press that never traveled past the slop is a tap: open it
            const isTap = moved <= CLICK_SLOP && performance.now() - downTime < 500;
            if (isTap && downAnchor && onTapRef.current) onTapRef.current(downAnchor, e);
            downAnchor = null;
        };

        measure();
        apply();

        if (draggable) {
            wrap.addEventListener("pointerdown", onDown);
            wrap.addEventListener("pointermove", onMove);
            wrap.addEventListener("pointerup", onUp);
            wrap.addEventListener("pointercancel", onUp);
        }

        // drift on the shared clock only while on screen and someone is watching
        const loop = reduce ? null : watchLoop(wrap, frame, { fps: 60, onStart: () => { last = 0; } });
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
            if (loop) loop.stop();
            if (ro) ro.disconnect();
        };
    }, [wrapRef, trackRef, copies, drift, draggable, draggedRef]);
}
