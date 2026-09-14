import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DuoMark } from "./DuoMark";
import { EASE } from "../lib/motion";

const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "Privacy", href: "#privacy" },
  { label: "Release", href: "#download" },
];

const SECTION_IDS = ["top", "experience", "privacy", "download"];

/**
 * A single floating segmented control, centered at the top of the page —
 * the whole navigation reduced to one small graphite pill. The active tab
 * is a shared-layout chip that slides between segments rather than four
 * separately styled links.
 */
export function MarketingNav() {
  const [active, setActive] = useState("#top");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50 flex justify-center pt-3 md:pt-4 px-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE.smooth }}
      >
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-0.5 rounded-full border border-border bg-card/75 p-1 pl-3 backdrop-blur-xl shadow-[var(--shadow-pop)]">
            <a href="#top" className="mr-2 flex items-center gap-2 pr-2 text-[11px] font-semibold uppercase text-foreground">
              <DuoMark size={18} animateIn={false} />
              DuoSpace
            </a>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-1.5 rounded-xl text-[12.5px] font-medium transition-colors",
                  active === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active === link.href && (
                  <motion.span
                    layoutId="nav-chip"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-accent"
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            ))}
            <a
              href="#download"
              className="ml-0.5 px-4 py-2 rounded-full text-[11px] uppercase duo-gradient text-primary-foreground font-semibold duo-glow active:brightness-90 transition-[filter] touch-manipulation"
            >
              Open app →
            </a>
          </nav>

          <div className="md:hidden flex items-center gap-1 rounded-full border border-border bg-card/80 p-1 pl-3 backdrop-blur-xl shadow-[var(--shadow-pop)]">
            <a href="#top" className="flex items-center gap-1.5 pr-1">
              <DuoMark size={18} animateIn={false} />
              <span className="text-[12.5px] font-semibold text-foreground">DuoSpace</span>
            </a>
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="h-8 w-8 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-accent active:bg-accent touch-manipulation"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/97 backdrop-blur-xl md:hidden flex flex-col justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE.smooth }}
          >
            <nav className="flex flex-col">
              {[...NAV_LINKS, { label: "Download", href: "#download" }].map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE.smooth, delay: 0.05 * i }}
                  whileTap={{ x: 6, color: "hsl(var(--duo-a))" }}
                  className="font-display text-4xl font-semibold tracking-[-0.03em] py-2.5 border-b border-border/60 text-foreground touch-manipulation"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
