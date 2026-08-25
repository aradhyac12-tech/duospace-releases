import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DuoMark } from "./DuoMark";
import { EASE } from "../lib/motion";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Privacy", href: "#privacy" },
];

const SECTION_IDS = ["top", "features", "privacy", "download"];

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
          <nav className="hidden md:flex items-center gap-0.5 rounded-xl bg-[hsl(220_9%_16%/0.94)] p-1 backdrop-blur-xl shadow-[0_10px_30px_-16px_rgba(0,0,0,0.5)]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-1.5 rounded-lg text-[12.5px] transition-colors",
                  active === link.href ? "text-white" : "text-white/50 hover:text-white/80",
                )}
              >
                {active === link.href && (
                  <motion.span
                    layoutId="nav-chip"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-lg duo-gradient opacity-[0.22]"
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            ))}
            <a
              href="#download"
              className="ml-0.5 px-3.5 py-1.5 rounded-lg text-[12.5px] duo-gradient text-white font-medium active:brightness-90 transition-[filter] touch-manipulation"
            >
              Get the app
            </a>
          </nav>

          <div className="md:hidden flex items-center gap-1 rounded-xl bg-[hsl(220_9%_16%/0.94)] p-1 pl-2.5 backdrop-blur-xl">
            <a href="#top" className="flex items-center gap-1.5 pr-1">
              <DuoMark size={18} animateIn={false} />
              <span className="text-[12.5px] text-white/85">DuoSpace</span>
            </a>
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-white/70 hover:bg-white/10 active:bg-white/20 touch-manipulation"
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
                  className="font-display text-4xl py-2.5 border-b border-border/60 text-foreground touch-manipulation"
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
