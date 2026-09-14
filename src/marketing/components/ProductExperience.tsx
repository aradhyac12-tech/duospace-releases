import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Images, Music2, MapPin, Palette, Pause, Play, RotateCcw } from "lucide-react";
import { DeviceMockup } from "./DeviceMockup";
import { ChatPreview } from "./ChatPreview";
import { CallsPreview } from "./CallsPreview";
import { GalleryPreview } from "./GalleryPreview";
import { GroicPreview } from "./GroicPreview";
import { MapPreview } from "./MapPreview";
import { PersonalizationPreview } from "./PersonalizationPreview";
import { LazyStill } from "./LazyStill";

const MODES = [
  { id: "chat", label: "Chat", eyebrow: "Talk", headline: "The conversation stays yours.", copy: "Messages, voice notes and reactions inside one thread made for two.", icon: MessageCircle, view: ChatPreview, dark: false },
  { id: "calls", label: "Calls", eyebrow: "Be there", headline: "Even when you're somewhere else.", copy: "Voice and video calling with clear controls and a live connection-quality signal.", icon: Phone, view: CallsPreview, dark: true },
  { id: "gallery", label: "Gallery", eyebrow: "Keep it", headline: "Some moments don't belong on a feed.", copy: "A private shared gallery where each memory stays inside your space.", icon: Images, view: GalleryPreview, dark: false },
  { id: "music", label: "Music", eyebrow: "Listen together", headline: "One soundtrack. Two people.", copy: "Groic brings search, queue and shared listening into one music surface.", icon: Music2, view: GroicPreview, dark: false },
  { id: "location", label: "Location", eyebrow: "Find each other", headline: "No broadcast. Just the two of you.", copy: "Private location sharing between partners, without an audience.", icon: MapPin, view: MapPreview, dark: true },
  { id: "personalization", label: "Personalize", eyebrow: "Make it yours", headline: "A space that looks like both of you.", copy: "Light, dark, AMOLED and monochrome themes reshape the same private world.", icon: Palette, view: PersonalizationPreview, dark: false },
] as const;

export function ProductExperience() {
  const [active, setActive] = useState(0);
  const mode = MODES[active];
  const Preview = mode.view;

  return (
    <section id="experience" className="relative px-5 py-24 md:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 md:mb-16 max-w-3xl">
          <p className="label-tiny uppercase text-muted-foreground">DuoSpace OS / 06 surfaces</p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-balance">
            One space. <span className="duo-text-gradient">Six ways</span> to be together.
          </h2>
        </div>

        <div className="cinema-panel overflow-hidden">
          <div className="flex overflow-x-auto border-b border-border p-2 md:justify-center" role="tablist" aria-label="DuoSpace experiences">
            {MODES.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  aria-controls="product-mode-panel"
                  onClick={() => setActive(index)}
                  className={`relative flex min-h-touch shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors ${active === index ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {active === index && <motion.span layoutId="experience-tab" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                  <Icon size={14} className="relative" />
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div id="product-mode-panel" role="tabpanel" className="relative grid min-h-[640px] grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-2 md:px-14 md:py-16">
            <div className="ambient-field absolute inset-0 opacity-60" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div key={`${mode.id}-copy`} initial={{ opacity: 0, y: 20, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(4px)" }} transition={{ duration: 0.45 }} className="relative z-10 max-w-md">
                <p className="label-tiny uppercase text-primary">{mode.eyebrow}</p>
                <h3 className="mt-4 font-display text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1] tracking-[-0.04em]">{mode.headline}</h3>
                <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">{mode.copy}</p>
                <p className="mt-10 font-mono text-[10px] uppercase text-muted-foreground">0{active + 1} / 06 · Select a surface above</p>
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 flex min-h-[420px] items-center justify-center">
              <div className="absolute h-64 w-64 rounded-full duo-gradient opacity-20 blur-3xl" aria-hidden />
              <AnimatePresence mode="wait">
                <motion.div key={mode.id} initial={{ opacity: 0, scale: 0.9, rotateY: -12 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={{ opacity: 0, scale: 0.94, rotateY: 12 }} transition={{ type: "spring", stiffness: 180, damping: 24 }}>
                  <LazyStill className="min-h-[1px]">
                    <DeviceMockup width="min(210px, 58vw)" widthMd={235} dark={mode.dark}>
                      <Preview />
                    </DeviceMockup>
                  </LazyStill>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GuidedDemo() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const mode = MODES[active];
  const Preview = mode.view;

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % MODES.length), 3200);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  const restart = () => { setActive(0); setPlaying(true); };

  return (
    <section className="relative px-5 py-24 md:py-32">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="label-tiny uppercase text-muted-foreground">Guided product loop</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em]">See DuoSpace in 20 seconds.</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label={playing ? "Pause demo" : "Play demo"} onClick={() => setPlaying((value) => !value)} className="icon-control">
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button type="button" aria-label="Restart demo" onClick={restart} className="icon-control"><RotateCcw size={16} /></button>
          </div>
        </div>

        <div className="cinema-panel relative grid min-h-[520px] items-center overflow-hidden p-6 md:grid-cols-[1fr_1.2fr] md:p-12">
          <div className="ambient-field absolute inset-0" aria-hidden />
          <AnimatePresence mode="wait">
            <motion.div key={`${mode.id}-demo-copy`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="relative z-10">
              <p className="font-mono text-[10px] uppercase text-primary">0{active + 1} / 06</p>
              <p className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em]">{mode.label}</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{mode.headline}</p>
            </motion.div>
          </AnimatePresence>
          <div className="relative z-10 flex justify-center py-8">
            <AnimatePresence mode="wait">
              <motion.div key={`${mode.id}-demo`} initial={{ opacity: 0, scale: 0.92, y: 22 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: -14 }} transition={{ duration: 0.5 }}>
                <DeviceMockup width="min(170px, 46vw)" widthMd={190} dark={mode.dark}><Preview /></DeviceMockup>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex h-1 gap-1" aria-hidden>
            {MODES.map((item, index) => <span key={item.id} className={`h-full flex-1 transition-colors ${index <= active ? "bg-primary" : "bg-border"}`} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
