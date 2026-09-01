import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const BARS = Array.from({ length: 24 }, (_, i) => 6 + Math.abs(Math.sin(i * 0.9)) * 26);

/**
 * Shared-listening mockup: album art, transport controls, and a waveform.
 * The play button is a real toggle — tapping it actually starts/stops the
 * waveform's motion (continuous bounce while "playing", frozen while
 * paused) instead of the bars just idly breathing regardless of state.
 */
export function GroicPreview() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col h-full bg-surface-0 px-[8%] py-[10%] items-center justify-center gap-[7%]">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-[68%] aspect-square rounded-2xl shadow-lg shrink-0"
        style={{ background: "linear-gradient(140deg, hsl(292 70% 55%), hsl(230 70% 45%))" }}
      />
      <div className="text-center">
        <p className="text-[12px] font-medium leading-tight">Late Night Drive</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
          shared queue · 2 listening
        </p>
      </div>

      <div className="flex items-end gap-[3px] h-8 max-w-full overflow-hidden" aria-hidden>
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-primary/70 shrink-0"
            initial={{ height: 4 }}
            animate={{ height: playing ? [h * 0.4, h, h * 0.5, h * 0.9] : h * 0.35 }}
            transition={
              playing
                ? { duration: 0.9 + (i % 5) * 0.15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                : { duration: 0.4 }
            }
          />
        ))}
      </div>

      <div className="flex items-center gap-[12%] w-full justify-center">
        <motion.button
          type="button"
          aria-label="Previous"
          whileTap={{ scale: 0.85, x: -2 }}
          className="touch-manipulation"
        >
          <SkipBack size={16} className="text-muted-foreground shrink-0" />
        </motion.button>
        <motion.button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          onClick={() => setPlaying((p) => !p)}
          whileTap={{ scale: 0.9 }}
          className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center touch-manipulation"
        >
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </motion.button>
        <motion.button
          type="button"
          aria-label="Next"
          whileTap={{ scale: 0.85, x: 2 }}
          className="touch-manipulation"
        >
          <SkipForward size={16} className="text-muted-foreground shrink-0" />
        </motion.button>
      </div>
    </div>
  );
}
