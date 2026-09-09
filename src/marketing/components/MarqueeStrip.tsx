import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "framer-motion";

interface MarqueeStripProps {
  items: string[];
  /** Base drift in pixels per second. */
  speed?: number;
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * A running band of words that drifts on its own and reacts to the reader:
 * scrolling down pushes it forward, scrolling up drags it back, and fast
 * scrolling skews the type slightly — the page's own momentum made visible.
 */
export function MarqueeStrip({ items, speed = 26 }: MarqueeStripProps) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 0, 4], {
    clamp: false,
  });
  const skew = useTransform(smoothVelocity, [-2000, 0, 2000], [3, 0, -3], { clamp: false });
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = direction.current * speed * (delta / 1000);
    const v = velocityFactor.get();
    if (v < 0) direction.current = -1;
    else if (v > 0) direction.current = 1;
    move += direction.current * move * Math.abs(v);
    baseX.set(baseX.get() + move);
  });

  // Four copies, each a third of the track wide, so the -33.33% wrap is seamless.
  const x = useTransform(baseX, (v) => `${wrap(-33.3333, 0, v / 24)}%`);

  return (
    <div className="relative overflow-hidden py-6 select-none" aria-hidden>
      <motion.div style={{ skewX: reduced ? 0 : skew }} className="flex whitespace-nowrap">
        <motion.div style={{ x }} className="flex whitespace-nowrap will-change-transform">
          {[0, 1, 2, 3].map((copy) => (
            <span key={copy} className="flex items-center">
              {items.map((item, i) => (
                <span key={`${copy}-${i}`} className="flex items-center">
                  <span className="font-display italic text-[clamp(1.6rem,4vw,3rem)] leading-none text-muted-foreground/70 px-5">
                    {item}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full duo-gradient shrink-0" />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
