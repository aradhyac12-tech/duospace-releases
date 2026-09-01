import { motion } from "framer-motion";
import { Lock, ShieldCheck, EyeOff } from "lucide-react";
import { revealUp, revealViewport, DURATION, EASE } from "../lib/motion";

const POINTS = [
  {
    icon: Lock,
    title: "End-to-end encrypted chat",
    copy: "Messages are encrypted on your device. The server stores ciphertext — never plaintext.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    copy: "Every table enforces row-level security and there's no admin surface in the app — your rows are reachable only by your pair.",
  },
  {
    icon: EyeOff,
    title: "Built-in cover",
    copy: "PIN and biometric app-lock, disappearing messages, and Peek Guard keep your space closed to anyone but the two of you.",
  },
];

/**
 * The quiet chapter. Three plain statements set as an indexed list on
 * paper — no glow, no particles; privacy stated the way a colophon
 * states a printing method.
 */
export function Privacy() {
  return (
    <section id="privacy" className="relative px-5 py-20 md:py-32">
      <div className="mx-auto max-w-[1180px]">
        <p className="label-tiny mb-2">
          <span className="text-foreground">Privacy</span>{" "}
          <span className="text-muted-foreground">Foundations</span>
        </p>

        <motion.h2
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          className="font-display text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.08] tracking-[-0.01em] max-w-2xl"
        >
          Nobody else is in the room. <em className="italic text-muted-foreground">Not even us.</em>
        </motion.h2>

        <div className="mt-12 md:mt-16 border-t border-border">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{ duration: DURATION.slow, ease: EASE.smooth, delay: i * 0.07 }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 py-6 md:py-8 border-b border-border rounded-md px-2 -mx-2 transition-colors hover:bg-surface-1 active:bg-surface-1 touch-manipulation"
            >
              <div className="md:col-span-1 flex items-center gap-3 text-muted-foreground">
                <span className="font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                <p.icon size={14} className="transition-colors group-hover:text-[hsl(var(--duo-a))]" />
              </div>
              <p className="md:col-span-4 text-[14px] font-medium">{p.title}</p>
              <p className="md:col-span-7 text-[13.5px] leading-relaxed text-muted-foreground max-w-xl">
                {p.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
