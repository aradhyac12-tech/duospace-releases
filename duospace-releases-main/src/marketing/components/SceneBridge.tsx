import { LucideIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { revealViewport, EASE } from "../lib/motion";

interface SceneBridgeProps {
  fromIcon: LucideIcon;
  toIcon: LucideIcon;
  label: string;
}

/**
 * The page turn between two feature spreads: a hairline rule that draws
 * itself as it enters, with a marker that travels along it in step with
 * scroll — the hand-off made visible without a literal device morph.
 */
export function SceneBridge({ label }: SceneBridgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0.15, 0.85], ["-18%", "18%"]);
  const dotScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.6, 1.4, 0.6]);

  return (
    <div ref={ref} className="relative px-5" aria-hidden>
      <div className="mx-auto max-w-[1180px] relative h-px">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={revealViewport}
          transition={{ duration: 1.1, ease: EASE.smooth }}
          className="absolute inset-0 origin-center bg-border"
        />
        <motion.span
          style={{ x, scale: dotScale }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full duo-gradient"
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
