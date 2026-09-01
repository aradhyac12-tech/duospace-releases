import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { DeviceMockup } from "../components/DeviceMockup";
import { ChatPreview } from "../components/ChatPreview";
import { CallsPreview } from "../components/CallsPreview";
import { HeroMark } from "../components/HeroMark";
import { WordReveal } from "../components/WordReveal";
import { EASE, DURATION } from "../lib/motion";

const line = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.cinematic * 0.7, ease: EASE.smooth, delay },
});

/**
 * Editorial masthead: the entire introduction is four quiet lines and one
 * small object, centered on paper. The product itself is deferred to the
 * tile below — restraint first, then the artefact.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const markOffset = useTransform(scrollYProgress, [0, 0.6], [22, 0]);
  const markCenterOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const stillY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section id="top" ref={sectionRef} className="relative px-5 pt-24 md:pt-28 overflow-hidden">
      {/* Fresh visual anchor: a slow, ambient duo-colour wash behind the
          masthead. It's the one place the brand's two hues bleed out past
          the mark itself — everything else stays quiet editorial paper. */}
      <motion.div
        aria-hidden
        style={{ y: reduced ? 0 : stillY }}
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[860px] max-w-[140vw] rounded-full blur-[120px] opacity-40 duo-gradient"
      />
      <div className="relative mx-auto max-w-[1180px]">
        {/* Masthead */}
        <div className="flex flex-col items-center text-center pt-10 md:pt-14 pb-14 md:pb-24">
          <motion.p {...line(0.05)} className="text-[12.5px] text-muted-foreground">
            A private space for two <span className="text-foreground">DuoSpace</span>
          </motion.p>
          <motion.p {...line(0.12)} className="mt-1 text-[12.5px] text-muted-foreground">
            Chat, calls, gallery, music &amp; map <span className="text-foreground">Android &amp; iOS</span>
          </motion.p>

          <motion.div
            {...line(0.2)}
            className="mt-7 h-[68px] w-[68px] rounded-2xl tile border border-border/70 flex items-center justify-center shadow-[var(--shadow-pop)]"
          >
            <HeroMark offset={markOffset} centerOpacity={markCenterOpacity} size={44} />
          </motion.div>

          <WordReveal
            as="h1"
            text="Everything you share, kept between the two of you."
            italicFrom={3}
            italicTo={4}
            emphasis="gradient"
            delay={0.25}
            className="mt-10 md:mt-14 font-display text-[clamp(2.1rem,6vw,3.9rem)] leading-[1.06] tracking-[-0.01em] max-w-3xl text-balance"
          />

          <motion.div {...line(0.4)} className="mt-8 flex items-center gap-2">
            <motion.a
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ y: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              href="#download"
              className="rounded-lg duo-gradient text-white text-[13px] px-4 py-2.5 min-h-touch inline-flex items-center active:brightness-90 transition-[filter] touch-manipulation"
            >
              Get DuoSpace
            </motion.a>
            <motion.a
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ y: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              href="#features"
              className="rounded-lg border border-border text-[13px] px-4 py-2.5 min-h-touch inline-flex items-center hover:bg-surface-2 active:bg-surface-2 transition-colors touch-manipulation"
            >
              Browse features
            </motion.a>
          </motion.div>
        </div>

        {/* The artefact: one wide still, two devices resting inside it */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE.smooth, delay: 0.5 }}
        >
          <p className="label-tiny mb-2 text-foreground">
            DuoSpace <span className="text-muted-foreground">Overview</span>
          </p>
          <motion.div
            style={{ y: reduced ? 0 : stillY }}
            className="tile relative flex items-center justify-center gap-4 md:gap-10 h-[380px] md:h-[520px] px-6 overflow-hidden"
          >
            <div className="absolute inset-0 paper-grid opacity-60" aria-hidden />
            <motion.div
              initial={{ y: 40, rotate: -3, opacity: 0 }}
              animate={{ y: 0, rotate: -3, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE.smooth, delay: 0.62 }}
              whileHover={{ rotate: 0, y: -12, scale: 1.05, zIndex: 2 }}
              className="relative"
            >
              <DeviceMockup width="min(132px, 34vw)" widthMd={208}>
                <ChatPreview />
              </DeviceMockup>
            </motion.div>
            <motion.div
              initial={{ y: 40, rotate: 3, opacity: 0 }}
              animate={{ y: 0, rotate: 3, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE.smooth, delay: 0.72 }}
              whileHover={{ rotate: 0, y: -12, scale: 1.05, zIndex: 2 }}
              className="relative"
            >
              <DeviceMockup width="min(132px, 34vw)" widthMd={208} dark>
                <CallsPreview />
              </DeviceMockup>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
