import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Counts a numeric fact up when it scrolls into view. Non-numeric values
 * are rendered verbatim so the same fact grid can hold "None" and "2".
 */
export function CountUp({ value, duration = 900 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const target = Number(value);
  const numeric = value.trim() !== "" && Number.isFinite(target);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !numeric) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, target, duration]);

  return <span ref={ref}>{numeric ? n : value}</span>;
}
