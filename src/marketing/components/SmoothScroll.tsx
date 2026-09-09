import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Weighted, inertial page scrolling.
 *
 * Lenis drives the real window scroll position (it doesn't transform a
 * wrapper), so every existing `useScroll`/IntersectionObserver reveal on the
 * page keeps working untouched — they simply receive a smoothed scroll
 * position instead of a raw wheel step.
 *
 * Deliberately window-scroll only and off for touch: phones already have
 * native momentum, and hijacking it there costs more than it adds. Users
 * who ask for reduced motion get plain native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Expo-out: fast pickup, long quiet settle — matches --ease-smooth.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // In-page anchors (#features, #download, the nav pill) should ride the
    // same easing instead of jumping.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a[href^='#']") as
        | HTMLAnchorElement
        | null;
      const hash = el?.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
