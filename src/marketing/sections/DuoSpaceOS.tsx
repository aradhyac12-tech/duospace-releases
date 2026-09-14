import { motion } from "framer-motion";
import { MessageCircle, Phone, Images, Music2, MapPin, Palette } from "lucide-react";
import { DuoMark } from "../components/DuoMark";
import { revealViewport } from "../lib/motion";

const NODES = [
  { label: "Chat", icon: MessageCircle }, { label: "Calls", icon: Phone }, { label: "Memories", icon: Images },
  { label: "Music", icon: Music2 }, { label: "Location", icon: MapPin }, { label: "Personalize", icon: Palette },
];

export function DuoSpaceOS() {
  return (
    <section className="relative px-5 py-28 md:py-40">
      <div className="mx-auto max-w-[1180px]">
        <div className="text-center">
          <p className="label-tiny uppercase text-primary">DuoSpace OS</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-none tracking-[-0.04em]">One private operating system<br className="hidden md:block" /> for your relationship.</h2>
        </div>
        <div className="relative mx-auto mt-16 aspect-square w-full max-w-[720px] md:mt-24">
          <div className="absolute inset-[12%] rounded-full border border-border" />
          <div className="absolute inset-[28%] rounded-full border border-primary/25" />
          <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/35 bg-card shadow-[var(--shadow-pop)] md:h-36 md:w-36">
            <DuoMark size={38} />
            <span className="mt-2 font-mono text-[10px] uppercase text-muted-foreground">Us</span>
          </div>
          {NODES.map((node, index) => {
            const angle = (index / NODES.length) * Math.PI * 2 - Math.PI / 2;
            const left = 50 + Math.cos(angle) * 40;
            const top = 50 + Math.sin(angle) * 40;
            const Icon = node.icon;
            return (
              <motion.div key={node.label} initial={{ opacity: 0, scale: 0.75 }} whileInView={{ opacity: 1, scale: 1 }} viewport={revealViewport} transition={{ delay: index * 0.08 }} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
                <div className="flex min-w-20 flex-col items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-3 backdrop-blur-md md:min-w-28">
                  <Icon size={16} className="text-primary" />
                  <span className="font-mono text-[8px] uppercase text-muted-foreground md:text-[10px]">{node.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
