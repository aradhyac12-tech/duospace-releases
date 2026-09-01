import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const THEMES = [
  { name: "Light", bg: "hsl(30 25% 95%)", fg: "hsl(255 30% 15%)", accent: "hsl(255 90% 62%)" },
  { name: "Dark", bg: "hsl(255 25% 10%)", fg: "hsl(30 15% 92%)", accent: "hsl(255 90% 68%)" },
  { name: "AMOLED", bg: "hsl(0 0% 4%)", fg: "hsl(0 0% 92%)", accent: "hsl(292 80% 66%)" },
  { name: "Monochrome", bg: "hsl(0 0% 14%)", fg: "hsl(0 0% 94%)", accent: "hsl(0 0% 70%)" },
];

/**
 * Demonstrates the app's real theme system (Light/Dark/AMOLED/Monochrome)
 * by idly cycling a mini preview surface between them — shows DuoSpace
 * "reshaping itself" without needing real screenshots of every mode.
 */
export function PersonalizationPreview() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % THEMES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const theme = THEMES[active]!;

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center gap-6 px-6"
      animate={{ backgroundColor: theme.bg }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        animate={{ backgroundColor: theme.accent }}
        transition={{ duration: 0.6 }}
        className="h-14 w-14 rounded-2xl flex items-center justify-center"
      >
        <Check size={20} color={theme.bg} />
      </motion.div>

      <motion.p animate={{ color: theme.fg }} transition={{ duration: 0.6 }} className="text-xs font-medium">
        {theme.name}
      </motion.p>

      <div className="flex items-center gap-2.5">
        {THEMES.map((t, i) => (
          <button
            key={t.name}
            aria-label={t.name}
            onClick={() => setActive(i)}
            className="h-6 w-6 rounded-full border-2 transition-transform"
            style={{
              background: t.bg,
              borderColor: i === active ? t.accent : "transparent",
              transform: i === active ? "scale(1.15)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
