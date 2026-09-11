import { motion } from "framer-motion";
import { DeviceMockup } from "../components/DeviceMockup";
import { LazyStill } from "../components/LazyStill";
import { TiltTile } from "../components/TiltTile";
import { ChatPreview } from "../components/ChatPreview";
import { CallsPreview } from "../components/CallsPreview";
import { GalleryPreview } from "../components/GalleryPreview";
import { GroicPreview } from "../components/GroicPreview";
import { MapPreview } from "../components/MapPreview";
import { PersonalizationPreview } from "../components/PersonalizationPreview";
import { marketingFeatures } from "../data/features";
import { revealViewport, DURATION, EASE } from "../lib/motion";

const PREVIEWS = {
  chat: ChatPreview,
  calls: CallsPreview,
  gallery: GalleryPreview,
  groic: GroicPreview,
  map: MapPreview,
  personalization: PersonalizationPreview,
} as const;

const KIND: Record<string, string> = {
  chat: "Messaging",
  calls: "Voice & video",
  gallery: "Memories",
  groic: "Music",
  map: "Location",
  personalization: "Appearance",
};

/** Bento spans + tile heights, so the grid reads as a composed board. */
const BENTO: Record<string, string> = {
  chat: "md:col-span-4",
  calls: "md:col-span-2",
  gallery: "md:col-span-2",
  groic: "md:col-span-4",
  map: "md:col-span-3",
  personalization: "md:col-span-3",
};

const HEIGHT: Record<string, string> = {
  chat: "h-[300px] md:h-[400px]",
  calls: "h-[300px] md:h-[400px]",
  gallery: "h-[300px] md:h-[380px]",
  groic: "h-[300px] md:h-[380px]",
  map: "h-[300px] md:h-[360px]",
  personalization: "h-[300px] md:h-[360px]",
};

/**
 * The index, as a bento board: white cards of varying width, each holding
 * one live product still, with the caption sitting inside the card.
 */
export function Ecosystem() {
  return (
    <section id="features" className="relative px-5 pt-20 md:pt-32 pb-8">
      <div className="mx-auto max-w-[1180px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: DURATION.slow, ease: EASE.smooth }}
          className="mb-8 md:mb-12 max-w-xl"
        >
          <p className="label-tiny uppercase tracking-[0.16em] text-muted-foreground">
            The ecosystem
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
            Six surfaces, <span className="duo-text-gradient">one private space.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">
          {marketingFeatures.map((f, i) => {
            const Preview = PREVIEWS[f.id];
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={revealViewport}
                transition={{ duration: DURATION.slow, ease: EASE.smooth, delay: 0.05 * (i % 3) }}
                className={`group block ${BENTO[f.id]}`}
              >
                <TiltTile
                  className={`tile tile-defer relative flex items-center justify-center ${HEIGHT[f.id]}`}
                >
                  <div className="absolute inset-0 paper-grid opacity-70" aria-hidden />
                  <div
                    className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-64 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 duo-gradient"
                    aria-hidden
                  />
                  {/* Only the label row navigates (in-page jump to the full
                      feature spread below) — the tile itself hosts real
                      interactive controls, and a <button> can't live inside
                      an <a>, so the link stays scoped to this row. */}
                  <a
                    href={`#${f.id}`}
                    className="absolute top-4 left-4 right-4 z-10 label-tiny flex items-center gap-1.5 touch-manipulation"
                  >
                    <span className="font-semibold text-foreground">{f.label}</span>
                    <span className="text-muted-foreground">{KIND[f.id]}</span>
                    <span className="ml-auto text-muted-foreground opacity-60 sm:opacity-0 sm:-translate-x-1 transition-all duration-300 sm:group-hover:opacity-100 sm:group-hover:translate-x-0">
                      →
                    </span>
                  </a>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.05, rotate: i % 2 ? 1.5 : -1.5 }}
                    whileTap={{ y: -6, scale: 1.02, rotate: i % 2 ? 1 : -1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative mt-6"
                  >
                    <LazyStill className="min-h-[1px]">
                      <DeviceMockup
                        width="min(128px, 36vw)"
                        widthMd={150}
                        dark={f.id === "calls" || f.id === "map"}
                      >
                        <Preview />
                      </DeviceMockup>
                    </LazyStill>
                  </motion.div>
                </TiltTile>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
