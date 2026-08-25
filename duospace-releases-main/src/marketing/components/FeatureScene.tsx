import { ReactNode, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { DeviceMockup } from "./DeviceMockup";
import { LazyStill } from "./LazyStill";
import { TiltTile } from "./TiltTile";
import { WordReveal } from "./WordReveal";
import { revealUp, revealViewport } from "../lib/motion";

interface FeatureSceneProps {
  id: string;
  eyebrow: string;
  headline: string;
  copy: string;
  children: ReactNode;
  /** Device still on the right instead of the left. */
  reverse?: boolean;
  /** Kept for API compatibility with the showcase sequence. */
  connected?: boolean;
}

/**
 * One feature spread. The still sits in a paper tile on one side, the
 * writing on the other, set in the display serif — an editorial page,
 * not a marketing card. The device drifts, rotates and settles with
 * scroll, and the tile itself reacts to the pointer, so each spread feels
 * handled rather than merely displayed.
 */
export function FeatureScene({ id, eyebrow, headline, copy, children, reverse }: FeatureSceneProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  // Calls and Map render dark screens — pass that through to the device
  // chrome so the status bar/home indicator stay legible against them.
  const dark = id === "calls" || id === "map";

  const deviceY = useTransform(p, [0, 1], [34, -34]);
  const deviceRotate = useTransform(p, [0, 0.5, 1], [reverse ? 4 : -4, 0, reverse ? -4 : 4]);
  const deviceScale = useTransform(p, [0, 0.5, 1], [0.94, 1, 0.94]);
  const gridShift = useTransform(p, [0, 1], ["0px", "-56px"]);

  return (
    <section id={id} ref={ref} className="relative px-5 py-14 md:py-20">
      <div
        className={`relative mx-auto max-w-[1180px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <motion.p
            initial={{ opacity: 0, x: reverse ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={revealViewport}
            transition={{ duration: 0.5 }}
            className="label-tiny mb-2"
          >
            <span className="text-foreground">{eyebrow}</span>{" "}
            <span className="text-muted-foreground">DuoSpace</span>
          </motion.p>
          <TiltTile className="tile tile-defer relative h-[300px] md:h-[400px] flex items-center justify-center">
            <motion.div
              style={{ y: reduced ? 0 : gridShift }}
              className="absolute -inset-y-16 inset-x-0 paper-grid opacity-50"
              aria-hidden
            />
            <motion.div
              style={
                reduced
                  ? {}
                  : { y: deviceY, rotate: deviceRotate, scale: deviceScale }
              }
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 1.04 }}
              className="relative"
            >
              <LazyStill className="min-h-[1px]">
                <DeviceMockup width="min(138px, 38vw)" widthMd={158} dark={dark}>
                  {children}
                </DeviceMockup>
              </LazyStill>
            </motion.div>
          </TiltTile>
        </div>

        <div className="max-w-sm md:px-6">
          <WordReveal
            as="h3"
            text={headline}
            className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.1] tracking-[-0.01em]"
          />
          <motion.p
            variants={revealUp}
            custom={0.1}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground"
          >
            {copy}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
