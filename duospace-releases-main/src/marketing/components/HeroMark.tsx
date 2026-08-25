import { motion, MotionValue, useTransform } from "framer-motion";
import { useId } from "react";

interface HeroMarkProps {
  /** Horizontal offset (px) applied to the left dot; right dot gets +offset. 0 = fused/resting. */
  offset: MotionValue<number>;
  /** 0 = dots apart, 1 = fused (shared space visible). */
  centerOpacity: MotionValue<number>;
  size?: number;
  className?: string;
}

const DOT_A = "hsl(228 74% 52%)";
const DOT_A_SOFT = "hsl(214 88% 62%)";
const DOT_B = "hsl(272 68% 60%)";
const DOT_B_SOFT = "hsl(292 76% 66%)";

/**
 * Hero version of the DuoSpace mark: two dots that the scroll-linked
 * `offset`/`centerOpacity` values pull apart and draw back together,
 * melting into one shape via the gooey filter as they meet.
 */
export function HeroMark({ offset, centerOpacity, size = 160, className }: HeroMarkProps) {
  const uid = useId().replace(/:/g, "");
  const negOffset = useTransform(offset, (v) => -v);
  const centerScale = useTransform(centerOpacity, [0, 1], [0.4, 1]);

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="DuoSpace"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={DOT_A_SOFT} />
          <stop offset="100%" stopColor={DOT_A} />
        </linearGradient>
        <linearGradient id={`${uid}-b`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={DOT_B} />
          <stop offset="100%" stopColor={DOT_B_SOFT} />
        </linearGradient>
        <filter id={`${uid}-goo`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>

      <g filter={`url(#${uid}-goo)`}>
        <motion.circle cx="46" cy="60" r="26" fill={`url(#${uid}-a)`} style={{ x: negOffset }} />
        <motion.circle cx="74" cy="60" r="26" fill={`url(#${uid}-b)`} style={{ x: offset }} />
      </g>

      <motion.ellipse
        cx="60"
        cy="60"
        rx="7"
        ry="13"
        fill="hsl(0 0% 100%)"
        style={{ opacity: centerOpacity, scale: centerScale, transformOrigin: "60px 60px" }}
      />
    </svg>
  );
}
