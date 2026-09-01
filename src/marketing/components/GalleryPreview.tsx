import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const TILES = [
  { hue: 214, big: true },
  { hue: 250 },
  { hue: 292 },
  { hue: 230 },
  { hue: 270, big: true },
  { hue: 200 },
];

/**
 * A curated gallery wall: soft gradient tiles standing in for real photos
 * (no stock imagery), gently staggered in on scroll.
 *
 * Real interaction: tapping a tile "favourites" it — a small heart fills
 * in and the tile gets a duo-tinted ring, held in state, instead of the
 * tap only ever producing a transient scale-down.
 */
export function GalleryPreview() {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className="h-full bg-surface-0 p-2 pt-[11%] grid grid-cols-3 gap-1.5 auto-rows-[1fr]">
      {TILES.map((t, i) => (
        <motion.button
          type="button"
          key={i}
          aria-label={liked.has(i) ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={liked.has(i)}
          onClick={() => toggle(i)}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.07 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className={`relative rounded-lg touch-manipulation ${t.big ? "col-span-2 row-span-2" : ""} ${
            liked.has(i) ? "ring-2 ring-offset-1 ring-offset-surface-0" : ""
          }`}
          style={{
            background: `linear-gradient(155deg, hsl(${t.hue} 70% 45%), hsl(${t.hue + 40} 70% 30%))`,
            ...(liked.has(i) ? { boxShadow: "0 0 0 2px hsl(var(--duo-a))" } : {}),
          }}
        >
          {liked.has(i) && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-white/90 flex items-center justify-center"
            >
              <Heart size={9} className="text-[hsl(var(--duo-a))]" fill="currentColor" />
            </motion.span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
