import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { DuoMark } from "./DuoMark";

interface Bubble {
  mine: boolean;
  text: string;
}

const THREAD: Bubble[] = [
  { mine: false, text: "made it home" },
  { mine: true, text: "good, miss you already" },
  { mine: false, text: "same. call in 10?" },
  { mine: true, text: "counting down" },
];

const REPLIES = ["can't wait", "on my way", "same here 🤍", "see you soon"];

/**
 * A representative DuoSpace chat mockup — same bubble shape (rounded-2xl,
 * rounded-br-md tail on the sender's side) and single-accent convention
 * ("mine" = solid primary) as the real Chat.tsx.
 *
 * Genuinely interactive, not just decorative: the composer at the bottom
 * actually sends — tapping it (or hitting enter) appends a real new bubble
 * and the other side "replies" a moment later, same as the idle typing
 * indicator used to fake.
 */
export function ChatPreview({ animate = true }: { animate?: boolean }) {
  const [thread, setThread] = useState(THREAD);
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (typing) return;
    setThread((t) => [...t, { mine: true, text: "on my way" }]);
    setTyping(true);
    window.setTimeout(() => {
      setThread((t) => [...t, { mine: false, text: REPLIES[Math.floor(Math.random() * REPLIES.length)]! }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="flex flex-col h-full bg-surface-0">
      <div className="flex items-center gap-2.5 px-4 pt-[13%] pb-3 border-b border-border/60 bg-surface-1">
        <DuoMark size={22} />
        <div>
          <p className="text-[11px] font-semibold leading-tight">Us</p>
          <p className="text-[9px] text-muted-foreground leading-tight">online</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end gap-1.5 px-3 py-3 overflow-hidden">
        <AnimatePresence initial={false}>
          {thread.map((b, i) => (
            <motion.div
              key={i}
              layout
              initial={animate ? { opacity: 0, y: 10, scale: 0.94 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ delay: i < THREAD.length ? 0.15 * i + 0.3 : 0, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`max-w-[78%] text-[11px] leading-snug px-3 py-2 touch-manipulation ${
                b.mine
                  ? "self-end bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                  : "self-start bg-surface-2 text-foreground rounded-2xl rounded-bl-md"
              }`}
            >
              {b.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="self-start flex items-center gap-1 bg-surface-2 rounded-2xl rounded-bl-md px-3 py-2.5"
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-soft motion-reduce:animate-none"
                  style={{ animationDelay: `${d * 0.15}s` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real composer — this is the one actually-functional control on the
          mockup, not decoration: tap it and a message really sends. */}
      <div className="flex items-center gap-2 px-3 pb-3 pt-1">
        <div className="flex-1 rounded-full bg-surface-2 px-3 py-2 text-[10px] text-muted-foreground">
          Message
        </div>
        <motion.button
          type="button"
          aria-label="Send message"
          onClick={send}
          whileTap={{ scale: 0.88 }}
          disabled={typing}
          className="h-7 w-7 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center touch-manipulation disabled:opacity-50"
        >
          <Send size={12} />
        </motion.button>
      </div>
    </div>
  );
}
