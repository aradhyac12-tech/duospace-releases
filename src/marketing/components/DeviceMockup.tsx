import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DeviceMockupProps {
  children: ReactNode;
  className?: string;
  /**
   * Base (mobile) width in px, or any CSS length/clamp() expression.
   */
  width?: number | string;
  /**
   * Optional width applied from the `md` breakpoint up, so one instance
   * covers every viewport instead of rendering a duplicate device per
   * breakpoint.
   */
  widthMd?: number | string;
  /**
   * Whether the screen content behind the status bar / home indicator is
   * dark, so that chrome renders in light ink instead of dark. Defaults to
   * false (light screen — matches most previews).
   */
  dark?: boolean;
}

const len = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

/**
 * A real phone chrome — thin bezel, dynamic-island notch, side buttons,
 * an on-screen status bar and home indicator — so these read as actual
 * device screenshots rather than rounded rectangles with app UI floating
 * inside them. Sizing is driven by CSS custom properties so a single
 * element responds to the viewport (no per-breakpoint clones).
 */
export function DeviceMockup({
  children,
  className,
  width = 300,
  widthMd,
  dark = false,
}: DeviceMockupProps) {
  const chrome = dark ? "text-white/95" : "text-neutral-900/85";
  const indicator = dark ? "bg-white/70" : "bg-black/30";

  return (
    <div
      className={cn(
        // Titanium-style rail: a thin brushed metal frame instead of the old
        // chunky black slab, with an even hairline bezel all the way round.
        "device-mockup relative rounded-[14%/6.6%] p-[2.4%]",
        "bg-[linear-gradient(145deg,#d8dade_0%,#8f949c_18%,#3f434a_46%,#23262b_62%,#6d727a_86%,#c9ccd1_100%)]",
        "shadow-[0_2px_2px_-1px_rgba(255,255,255,0.55)_inset,0_40px_70px_-28px_rgba(15,18,25,0.55),0_10px_24px_-14px_rgba(15,18,25,0.4)]",
        className,
      )}
      style={
        {
          "--device-w": len(width),
          "--device-w-md": len(widthMd ?? width),
          width: "var(--device-w)",
        } as React.CSSProperties
      }
    >
      {/* Machined side buttons, flush with the rail. */}
      <span className="absolute -left-[1.5px] top-[18%] h-[4.5%] w-[1.5px] rounded-l-full bg-neutral-500/80" aria-hidden />
      <span className="absolute -left-[1.5px] top-[26%] h-[8.5%] w-[1.5px] rounded-l-full bg-neutral-500/80" aria-hidden />
      <span className="absolute -right-[1.5px] top-[23%] h-[10.5%] w-[1.5px] rounded-r-full bg-neutral-500/80" aria-hidden />

      {/* Black bezel gap between rail and glass. */}
      <div className="rounded-[12%/5.6%] bg-neutral-950 p-[1.6%]">
        <div className="rounded-[11%/5.2%] overflow-hidden bg-background aspect-[9/19.5] relative">
          {children}

          {/* Status bar */}
          <div
            aria-hidden
            className={cn(
              "absolute top-0 inset-x-0 z-20 flex items-center justify-between px-[8%] pt-[3.2%] text-[8px] font-semibold tracking-tight pointer-events-none",
              chrome,
            )}
          >
            <span>9:41</span>
            <span className="flex items-center gap-[3px]">
              <svg width="10" height="7" viewBox="0 0 12 8" fill="none" aria-hidden>
                <rect x="0" y="4" width="2" height="4" rx="0.6" fill="currentColor" />
                <rect x="3.3" y="2.5" width="2" height="5.5" rx="0.6" fill="currentColor" />
                <rect x="6.6" y="1" width="2" height="7" rx="0.6" fill="currentColor" />
                <rect x="9.9" y="0" width="2" height="8" rx="0.6" fill="currentColor" opacity="0.45" />
              </svg>
              <svg width="10" height="8" viewBox="0 0 14 10" fill="none" aria-hidden>
                <path
                  d="M1 3.5C4.5 0.5 9.5 0.5 13 3.5M3.2 5.8C5.5 4 8.5 4 10.8 5.8M5.6 8C6.4 7.3 7.6 7.3 8.4 8"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="flex items-center">
                <span className="h-[6px] w-[13px] rounded-[2.5px] border border-current relative flex items-center px-[1px]">
                  <span className="block h-full w-[78%] rounded-[1.5px] bg-current" />
                </span>
                <span className="ml-[1px] h-[3px] w-[1.5px] rounded-r-sm bg-current opacity-60" />
              </span>
            </span>
          </div>

          {/* Dynamic island — narrower, pill-tight, with a camera lens dot. */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[1.5%] z-20 flex items-center justify-end w-[24%] h-[2.7%] min-h-[9px] rounded-full bg-black pr-[6%]">
            <span className="h-[38%] min-h-[3px] aspect-square rounded-full bg-[radial-gradient(circle_at_35%_30%,#3b4a63,#0b0e14_70%)]" />
          </div>

          {/* Home indicator */}
          <div
            aria-hidden
            className={cn(
              "absolute bottom-[1.2%] left-1/2 -translate-x-1/2 h-[2.5px] w-[30%] rounded-full z-20 pointer-events-none",
              indicator,
            )}
          />

          {/* Glass: soft edge vignette plus one restrained diagonal sheen. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[0_0_0_1px_rgba(255,255,255,0.07)_inset]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 opacity-[0.06] bg-gradient-to-tr from-transparent via-white to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

