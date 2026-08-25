import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { DuoMark } from "./DuoMark";

/**
 * Representative active-call UI: avatar/mark, call duration, network
 * quality dots, and the same three-button control row (mute / video /
 * end) used in the real CallContext-driven ActiveCallOverlay.
 *
 * The three controls are real toggles, not static icons — tapping mute
 * or video actually flips state (icon swap, background tint, a tiny
 * "muted" label), the way they would mid-call. End stays a no-op
 * confirmation pulse rather than actually navigating away from the demo.
 */
export function CallsPreview() {
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [ending, setEnding] = useState(false);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[hsl(255_40%_14%)] to-[hsl(255_50%_8%)] text-white">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <span className="absolute inset-0 rounded-full bg-white/10 animate-ping motion-reduce:animate-none" />
          <span className="relative flex h-20 w-20 rounded-full bg-white/10 items-center justify-center">
            <DuoMark size={40} />
          </span>
        </motion.div>
        <div className="text-center">
          <p className="text-[13px] font-medium">Us</p>
          <p className="text-[10px] text-white/60 mt-0.5 font-mono">
            {muted ? "Muted" : "04:12"}
          </p>
        </div>
        <div className="flex items-center gap-1 mt-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-emerald-400" style={{ opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-5 pb-8 pt-2">
        <motion.button
          type="button"
          aria-label={muted ? "Unmute" : "Mute"}
          aria-pressed={muted}
          onClick={() => setMuted((m) => !m)}
          whileTap={{ scale: 0.88 }}
          className={`h-11 w-11 rounded-full flex items-center justify-center touch-manipulation transition-colors ${
            muted ? "bg-white text-neutral-900" : "bg-white/10 text-white"
          }`}
        >
          {muted ? <MicOff size={16} /> : <Mic size={16} />}
        </motion.button>
        <motion.button
          type="button"
          aria-label="End call"
          onClick={() => {
            setEnding(true);
            window.setTimeout(() => setEnding(false), 420);
          }}
          animate={ending ? { scale: [1, 0.85, 1] } : {}}
          whileTap={{ scale: 0.88 }}
          className="h-14 w-14 rounded-full bg-red-500 flex items-center justify-center touch-manipulation"
        >
          <PhoneOff size={18} />
        </motion.button>
        <motion.button
          type="button"
          aria-label={videoOn ? "Turn camera off" : "Turn camera on"}
          aria-pressed={!videoOn}
          onClick={() => setVideoOn((v) => !v)}
          whileTap={{ scale: 0.88 }}
          className={`h-11 w-11 rounded-full flex items-center justify-center touch-manipulation transition-colors ${
            !videoOn ? "bg-white text-neutral-900" : "bg-white/10 text-white"
          }`}
        >
          {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
        </motion.button>
      </div>
    </div>
  );
}
