import { ReactNode, useEffect, useRef, useState } from "react";

interface LazyStillProps {
  children: ReactNode;
  /** Space reserved before the still mounts, so nothing shifts on load. */
  className?: string;
  /** How far ahead of the viewport to mount. */
  rootMargin?: string;
}

/**
 * Mounts a device still (and its framer-motion tree) only once it is close
 * to the viewport, then keeps it mounted. Off-screen spreads therefore cost
 * nothing at first paint — the visual result is identical because each
 * still's own entrance animation is scroll-triggered anyway.
 */
export function LazyStill({ children, className, rootMargin = "400px" }: LazyStillProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  );
}
