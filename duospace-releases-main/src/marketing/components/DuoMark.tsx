import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

interface DuoMarkProps {
  size?: number;
  className?: string;
  /** Plays the two-dots-come-together intro on mount. */
  animateIn?: boolean;
}

/** Brand duo: cobalt accent + its violet companion, matching the light theme. */
const DOT_A = "hsl(228 74% 52%)";
const DOT_A_SOFT = "hsl(214 88% 62%)";
const DOT_B = "hsl(272 68% 60%)";
const DOT_B_SOFT = "hsl(292 76% 66%)";

/**
 * DuoSpace mark: two dots that travel in from opposite sides and fuse into
 * one shape — "two people, one space". Gooey filter makes the meeting point
 * melt rather than overlap. Reactive: hover pulls the dots apart and springs
 * them back, tap squeezes them together.
 */
export function DuoMark({ size = 40, className, animateIn = true }: DuoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const reduced = useReducedMotion();

  const spring = { type: "spring" as const, stiffness: 260, damping: 18, mass: 0.7 };

  return (
    <motion.svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="DuoSpace"
      initial={animateIn && !reduced ? "hidden" : "rest"}
      animate="rest"
      whileHover="apart"
      whileTap="tight"
      variants={{
        hidden: { rotate: -12, scale: 0.85 },
        rest: { rotate: 0, scale: 1 },
        apart: { rotate: 0, scale: 1.04 },
        tight: { scale: 0.94 },
      }}
      transition={spring}
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
        <filter id={`${uid}-goo`} x="-50%" y="-50%" width="200%" height="200%">
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
        <motion.circle
          cx="46"
          cy="60"
          r="26"
          fill={`url(#${uid}-a)`}
          variants={{
            hidden: { x: -46, opacity: 0 },
            rest: { x: 0, opacity: 1 },
            apart: { x: -7 },
            tight: { x: 5 },
          }}
          transition={spring}
        />
        <motion.circle
          cx="74"
          cy="60"
          r="26"
          fill={`url(#${uid}-b)`}
          variants={{
            hidden: { x: 46, opacity: 0 },
            rest: { x: 0, opacity: 1 },
            apart: { x: 7 },
            tight: { x: -5 },
          }}
          transition={spring}
        />
      </g>

      {/* The shared space where the two meet */}
      <motion.ellipse
        cx="60"
        cy="60"
        rx="7"
        ry="13"
        fill="hsl(0 0% 100%)"
        variants={{
          hidden: { opacity: 0, scale: 0.2 },
          rest: { opacity: 0.95, scale: 1 },
          apart: { opacity: 0.6, scale: 0.85 },
          tight: { opacity: 1, scale: 1.1 },
        }}
        transition={{ ...spring, delay: reduced ? 0 : 0.12 }}
        style={{ transformOrigin: "60px 60px" }}
      />
    </motion.svg>
  );
}
