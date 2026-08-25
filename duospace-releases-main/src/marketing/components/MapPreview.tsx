import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

/**
 * Stylized, lightweight map — no real tiles/imagery. Two points drift
 * toward a shared marker, echoing the site's "two → one" motif without
 * pretending to be a real maps product.
 *
 * Tapping anywhere on the map replays the meet-up animation (key remount),
 * so it's a real interaction rather than a one-shot scroll reveal.
 */
export function MapPreview() {
  const prefersReducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);

  return (
    <button
      type="button"
      aria-label="Replay location meet-up animation"
      onClick={() => setRun((r) => r + 1)}
      className="relative h-full w-full bg-[hsl(255_25%_10%)] overflow-hidden block touch-manipulation"
    >
      {/* Faint grid standing in for a map surface */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(255 40% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(255 40% 60%) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div key={run}>
          <motion.div
            className="absolute left-[26%] top-[62%]"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: 40, y: -14, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <MapPin size={18} className="text-[hsl(214_90%_65%)]" fill="hsl(214 90% 65% / 0.3)" />
          </motion.div>

          <motion.div
            className="absolute right-[24%] top-[30%]"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: -36, y: 18, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <MapPin size={18} className="text-[hsl(292_80%_68%)]" fill="hsl(292 80% 68% / 0.3)" />
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={prefersReducedMotion ? { scale: 1, opacity: 0 } : { scale: 4, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.4, delay: 0.9 }
                : { duration: 1.2, delay: 0.9, repeat: Infinity, repeatDelay: 1.5 }
            }
          />
        </motion.div>
      </AnimatePresence>

      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-white/35">Tap to replay</p>
    </button>
  );
}
