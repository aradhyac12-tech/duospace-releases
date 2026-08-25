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
  const chrome = dark ? "text-white/90" : "text-neutral-900/80";
  const indicator = dark ? "bg-white/60" : "bg-black/25";

  return (
    <div
      className={cn(
        "device-mockup relative rounded-[2.6rem] p-2.5 bg-neutral-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]",
        // Faint top-left rim light, restrained — reads as "physically present" without heavy 3D/gloss.
        "before:content-[''] before:absolute before:inset-0 before:rounded-[2.6rem] before:pointer-events-none",
        "before:bg-gradient-to-br before:from-white/[0.08] before:via-transparent before:to-transparent",
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
      {/* Physical side buttons — protrude slightly past the bezel edge so
          the frame reads as a machined object, not a flat sticker. */}
      <span className="absolute -left-[2px] top-[19%] h-[5%] w-[2px] rounded-l-sm bg-neutral-800" aria-hidden />
      <span className="absolute -left-[2px] top-[27%] h-[9%] w-[2px] rounded-l-sm bg-neutral-800" aria-hidden />
      <span className="absolute -right-[2px] top-[23%] h-[11%] w-[2px] rounded-r-sm bg-neutral-800" aria-hidden />

      <div className="rounded-[2.1rem] overflow-hidden bg-background aspect-[9/19.5] relative">
        {children}

        {/* Status bar — on top of whatever screen is showing, so every
            preview instantly reads as a real capture rather than a widget. */}
        <div
          aria-hidden
          className={cn(
            "absolute top-0 inset-x-0 z-20 flex items-center justify-between px-[9%] pt-[3.5%] text-[8px] font-medium tracking-tight pointer-events-none",
            chrome,
          )}
        >
          <span>9:41</span>
          <span className="flex items-center gap-[3px]">
            {/* signal */}
            <svg width="10" height="7" viewBox="0 0 12 8" fill="none" aria-hidden>
              <rect x="0" y="4" width="2" height="4" rx="0.5" fill="currentColor" />
              <rect x="3.3" y="2.5" width="2" height="5.5" rx="0.5" fill="currentColor" />
              <rect x="6.6" y="1" width="2" height="7" rx="0.5" fill="currentColor" />
              <rect x="9.9" y="0" width="2" height="8" rx="0.5" fill="currentColor" opacity="0.5" />
            </svg>
            {/* wifi */}
            <svg width="10" height="8" viewBox="0 0 14 10" fill="none" aria-hidden>
              <path
                d="M1 3.5C4.5 0.5 9.5 0.5 13 3.5M3.2 5.8C5.5 4 8.5 4 10.8 5.8M5.6 8C6.4 7.3 7.6 7.3 8.4 8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {/* battery */}
            <span className="flex items-center">
              <span className="h-[6px] w-[14px] rounded-[2px] border border-current relative flex items-center px-[1px]">
                <span className="block h-full w-[75%] rounded-[1px] bg-current" />
              </span>
              <span className="ml-[1px] h-[3px] w-[1.5px] rounded-r-sm bg-current opacity-70" />
            </span>
          </span>
        </div>

        {/* Dynamic-island / notch */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[1.8%] w-[30%] h-[3%] min-h-[10px] rounded-full bg-neutral-900 z-20" />

        {/* Home indicator */}
        <div
          aria-hidden
          className={cn(
            "absolute bottom-[1.4%] left-1/2 -translate-x-1/2 h-[3px] w-[28%] rounded-full z-20 pointer-events-none",
            indicator,
          )}
        />

        {/* Restrained diagonal screen reflection — reads as glass, not gloss. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.05] bg-gradient-to-tr from-transparent via-white to-transparent"
        />
      </div>
    </div>
  );
}
