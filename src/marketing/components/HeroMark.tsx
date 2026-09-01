import { motion, MotionValue, useTransform } from "framer-motion";

import markAsset from "@/assets/duospace-mark.png.asset.json";

interface HeroMarkProps {
  /** Scroll-linked offset (px). 0 = resting. */
  offset: MotionValue<number>;
  /** 0 = far, 1 = settled. */
  centerOpacity: MotionValue<number>;
  size?: number;
  className?: string;
}

/**
 * Hero rendering of the official DuoSpace app mark. The scroll-linked
 * values drive a gentle lift/settle instead of redrawing the artwork.
 */
export function HeroMark({ offset, centerOpacity, size = 160, className }: HeroMarkProps) {
  const scale = useTransform(centerOpacity, [0, 1], [0.88, 1]);
  const y = useTransform(offset, (v) => v * 0.35);
  const opacity = useTransform(centerOpacity, [0, 1], [0.7, 1]);

  return (
    <motion.img
      src={markAsset.url}
      alt="DuoSpace"
      width={size}
      height={size}
      decoding="async"
      className={className}
      style={{ width: size, height: size, display: "block", scale, y, opacity }}
    />
  );
}
