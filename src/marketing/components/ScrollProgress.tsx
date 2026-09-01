import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline reading-progress rule pinned to the very top of the page.
 * Spring-smoothed so it trails the scroll slightly instead of snapping.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 z-[60] h-[2px] origin-left duo-gradient"
    />
  );
}
