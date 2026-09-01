import { ElementType, ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE } from "../lib/motion";

interface WordRevealProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Words rendered in the muted display italic (by index). */
  italicFrom?: number;
  italicTo?: number;
  /** Styling for the italic range: quiet muted-grey (default) or the duo
   *  brand gradient, for the one or two headlines that should carry the
   *  fresh accent colour. */
  emphasis?: "muted" | "gradient";
  children?: ReactNode;
}

/**
 * Headline that arrives word by word from below a clipping mask — the
 * editorial equivalent of type being set line by line.
 */
export function WordReveal({
  text,
  className,
  as = "h2",
  delay = 0,
  italicFrom,
  italicTo,
  emphasis = "muted",
}: WordRevealProps) {
  const Tag = motion[as as "h2"] ?? motion.h2;
  const words = text.split(" ");

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
    >
      {words.map((w, i) => {
        const italic =
          italicFrom !== undefined && i >= italicFrom && i <= (italicTo ?? words.length);
        return (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.06em]">
            <motion.span
              className={`inline-block ${italic ? `italic ${emphasis === "gradient" ? "duo-text-gradient" : "text-muted-foreground"}` : ""}`}
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: EASE.smooth } },
              }}
            >
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
