import { DuoMark } from "./DuoMark";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Privacy", href: "#privacy" },
  { label: "Download", href: "#download" },
];

export function MarketingFooter() {
  return (
    <footer className="relative px-5 pb-12">
      <div className="mx-auto max-w-[1180px] border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <DuoMark size={20} animateIn={false} />
          <span className="text-[12.5px]">DuoSpace</span>
          <span className="text-[12.5px] text-muted-foreground">A private space for two</span>
        </div>

        <nav className="flex items-center gap-5">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[12.5px] text-muted-foreground hover:text-foreground active:text-foreground transition-colors touch-manipulation"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="text-[11px] font-mono text-muted-foreground/70">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
