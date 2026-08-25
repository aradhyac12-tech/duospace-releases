import { motion } from "framer-motion";
import { revealUp, revealViewport, EASE } from "../lib/motion";
import { DuoMark } from "../components/DuoMark";
import { CountUp } from "../components/CountUp";

const FACTS = [
  { k: "Members per space", v: "2" },
  { k: "Group threads", v: "0" },
  { k: "Ads or feeds", v: "None" },
  { k: "Surfaces", v: "Six" },
];

/**
 * A single centered spread: the mark on paper, one serif line, and four
 * hairline facts. The whole "built for two" argument as a colophon.
 */
export function BuiltForTwo() {
  return (
    <section id="experience" className="relative px-5 py-24 md:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="tile relative overflow-hidden px-6 py-20 md:py-28 flex flex-col items-center text-center">
          <div className="absolute inset-0 paper-grid opacity-60" aria-hidden />

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={revealViewport}
            transition={{ duration: 0.6, ease: EASE.spring }}
            className="relative"
          >
            <motion.div whileHover={{ scale: 1.12, rotate: 6 }} whileTap={{ scale: 0.94 }}>
              <DuoMark size={52} />
            </motion.div>
          </motion.div>

          <motion.h2
            variants={revealUp}
            custom={0.1}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            className="relative mt-8 font-display text-[clamp(1.9rem,4.6vw,3.1rem)] leading-[1.08] tracking-[-0.01em] max-w-2xl text-balance"
          >
            Two people. One space. <em className="italic text-muted-foreground">No audience.</em>
          </motion.h2>

          <motion.div
            variants={revealUp}
            custom={0.2}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            className="relative mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-border w-full max-w-2xl border border-border"
          >
            {FACTS.map((f, i) => (
              <motion.div
                key={f.k}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={{ duration: 0.5, ease: EASE.smooth, delay: 0.25 + i * 0.08 }}
                whileHover={{ y: -4 }}
                whileTap={{ y: -2 }}
                className="bg-surface-1 px-4 py-5 transition-colors hover:bg-surface-0 active:bg-surface-0"
              >
                <p className="font-display text-2xl leading-none">
                  <CountUp value={f.v} />
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">{f.k}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
