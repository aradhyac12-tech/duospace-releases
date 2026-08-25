import { MouseEvent, ReactNode, TouchEvent, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltTileProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis. */
  intensity?: number;
}

/**
 * Pointer-reactive tile: a very small 3D tilt plus a soft duo-colour light
 * spot that follows the touch/cursor. Amplitude is deliberately low so the
 * paper aesthetic survives — it reads as a sheet catching light, not a 3D
 * card.
 *
 * Touch parity: mouse and touch drive the exact same rx/ry/mx/my motion
 * values, so a finger dragged across the tile tilts and lights it up the
 * same way a cursor does — this used to be mouse-only and completely inert
 * on phones. The glow's visibility is now driven by JS state instead of
 * CSS :hover, since :hover never fires on touch.
 */
export function TiltTile({ children, className, intensity = 5 }: TiltTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glowOpacity = useSpring(useMotionValue(0), { stiffness: 260, damping: 30 });
  const glow = useMotionTemplate`radial-gradient(340px circle at ${mx}% ${my}%, hsl(var(--duo-a) / 0.16), hsl(var(--duo-b) / 0.1) 45%, transparent 68%)`;

  const updateFromPoint = (clientX: number, clientY: number) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (clientX - r.left) / r.width;
    const py = (clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * intensity * 2);
    rx.set(-(py - 0.5) * intensity * 2);
  };

  const settle = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
    glowOpacity.set(0);
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    updateFromPoint(e.clientX, e.clientY);
    glowOpacity.set(0.55);
  };

  // Passive by default (no preventDefault), so the page keeps scrolling
  // normally — we're only reading the touch position, not capturing it.
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) {
      updateFromPoint(t.clientX, t.clientY);
      glowOpacity.set(0.55);
    }
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) updateFromPoint(t.clientX, t.clientY);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={settle}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={settle}
      onTouchCancel={settle}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={cn("group/tilt relative [transform-style:preserve-3d]", className)}
    >
      <motion.div
        aria-hidden
        style={{ backgroundImage: glow, opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0"
      />
      {children}
    </motion.div>
  );
}
