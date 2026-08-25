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

/**
 * The index: every surface as a still on paper. Two columns, one tile per
 * feature, a hairline caption above each — a contact sheet of the product
 * rather than a marketing feature grid.
 */
export function Ecosystem() {
  return (
    <section id="features" className="relative px-5 pt-20 md:pt-32 pb-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:gap-y-14">
          {marketingFeatures.map((f, i) => {
            const Preview = PREVIEWS[f.id];
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 34, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={revealViewport}
                transition={{ duration: DURATION.slow, ease: EASE.smooth, delay: 0.06 * (i % 2) }}
                className="group block"
              >
                {/* Only the label row navigates (in-page jump to the full
                    feature spread below) — the tile itself now hosts real
                    interactive controls (send a message, mute a call,
                    play/pause), and a <button> can't legally live inside
                    an <a>, so the link stays scoped to this row. */}
                <a href={`#${f.id}`} className="label-tiny mb-2 flex items-center gap-1.5 touch-manipulation">
                  <span className="text-foreground">{f.label}</span>{" "}
                  <span className="text-muted-foreground">{KIND[f.id]}</span>
                  <span className="ml-auto text-muted-foreground opacity-60 sm:opacity-0 -translate-x-0 sm:-translate-x-1 transition-all duration-300 sm:group-hover:opacity-100 sm:group-hover:translate-x-0">
                    →
                  </span>
                </a>
                <TiltTile className="tile tile-defer relative h-[280px] md:h-[360px] flex items-center justify-center">
                  <div className="absolute inset-0 paper-grid opacity-50" aria-hidden />
                  <motion.div
                    whileHover={{ y: -10, scale: 1.05, rotate: i % 2 ? 1.5 : -1.5 }}
                    whileTap={{ y: -6, scale: 1.02, rotate: i % 2 ? 1 : -1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative"
                  >
                    <LazyStill className="min-h-[1px]">
                      <DeviceMockup width="min(128px, 36vw)" widthMd={150} dark={f.id === "calls" || f.id === "map"}>
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
