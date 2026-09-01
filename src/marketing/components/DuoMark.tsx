import { motion, useReducedMotion } from "framer-motion";

import markAsset from "@/assets/duospace-mark.png.asset.json";

interface DuoMarkProps {
  size?: number;
  className?: string;
  /** Plays the intro on mount. */
  animateIn?: boolean;
}

/**
 * The official DuoSpace app mark, rendered exactly as it ships in the app.
 * Motion is applied to the image only — the artwork itself is untouched.
 */
export function DuoMark({ size = 40, className, animateIn = true }: DuoMarkProps) {
  const reduced = useReducedMotion();
  const spring = { type: "spring" as const, stiffness: 260, damping: 18, mass: 0.7 };

  return (
    <motion.img
      src={markAsset.url}
      alt="DuoSpace"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ width: size, height: size, display: "block" }}
      initial={animateIn && !reduced ? { opacity: 0, scale: 0.82, rotate: -8 } : false}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      transition={spring}
    />
  );
}
