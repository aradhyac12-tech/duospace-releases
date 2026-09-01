import { useState, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springSnappy } from "../lib/motion";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  target?: string;
  rel?: string;
}

const BASE =
  "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold min-h-touch transition-[colors,box-shadow] duration-200";
const VARIANTS: Record<string, string> = {
  primary: "duo-gradient duo-glow text-white active:brightness-90",
  secondary: "bg-surface-2 text-foreground border border-border hover:bg-surface-3 active:bg-surface-3",
  ghost: "text-foreground hover:bg-surface-2 active:bg-surface-2",
};

/**
 * CTA button with a very small pointer-following "magnetic" offset on
 * desktop hover (amplitude capped low — perceived, not obvious) plus a
 * standard tactile press. Framer Motion's own reduced-motion handling
 * (MotionConfig at the app root) disables the magnetic offset automatically.
 *
 * whileTap fires on touchstart as well as mousedown, so the press-scale
 * already worked on phones — the `active:` classes above just add matching
 * colour/brightness feedback so a tap doesn't feel colour-dead, and replace
 * Tailwind's sticky-hover `hover:` reliance on primary with a real press
 * state.
 */
export function MagneticButton({
  children,
  onClick,
  href,
  variant = "primary",
  className,
  target,
  rel,
}: MagneticButtonProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // Cap amplitude — perceived, not a visible chase.
    setPos({ x: relX * 0.12, y: relY * 0.22 });
  };

  const handleLeave = () => setPos({ x: 0, y: 0 });

  const sharedProps = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    animate: { x: pos.x, y: pos.y },
    transition: springSnappy,
    whileTap: { scale: 0.96 },
    className: cn(BASE, VARIANTS[variant], className),
  };

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} onClick={onClick} {...sharedProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...sharedProps}>
      {children}
    </motion.button>
  );
}
