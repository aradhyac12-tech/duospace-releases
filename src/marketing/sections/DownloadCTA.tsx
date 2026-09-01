import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Apple, Globe, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  resolveDownloadLinks,
  resolveReleaseMeta,
  guessPlatform,
  type PlatformGuess,
} from "../data/downloadLinks";
import { publishedReleaseQueryOptions } from "@/lib/release-queries";
import { revealUp, revealViewport } from "../lib/motion";
import { DuoMark } from "../components/DuoMark";

function PlatformRow({
  icon: Icon,
  label,
  sublabel,
  url,
  primary,
}: {
  icon: typeof Smartphone;
  label: string;
  sublabel: string;
  url: string | null;
  primary?: boolean;
}) {
  const inner = (
    <>
      <span className="flex items-center gap-3">
        <Icon size={16} className={primary ? "" : "text-muted-foreground"} />
        <span className="text-[13.5px] font-medium">{label}</span>
      </span>
      <span className="flex items-center gap-2">
        <span className={`text-[11.5px] ${primary ? "opacity-70" : "text-muted-foreground"}`}>
          {url ? sublabel : "Coming soon"}
        </span>
        {url && <ArrowUpRight size={14} className={primary ? "opacity-70" : "text-muted-foreground"} />}
      </span>
    </>
  );

  const base =
    "flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 min-h-touch transition-[colors,filter,transform] duration-150 w-full touch-manipulation active:scale-[0.985]";

  if (!url) {
    return <div className={`${base} border border-dashed border-border opacity-55`}>{inner}</div>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${
        primary
          ? "duo-gradient text-white active:brightness-90"
          : "border border-border hover:bg-surface-2 active:bg-surface-2"
      }`}
    >
      {inner}
    </a>
  );
}

/**
 * The last page: the mark, one serif line, and the release itself listed
 * as three plain rows. Download links still come from the published
 * release record, with env fallbacks — only the presentation changed.
 */
export function DownloadCTA() {
  const [platform, setPlatform] = useState<PlatformGuess>("desktop");
  const { data: release } = useQuery(publishedReleaseQueryOptions);
  const links = resolveDownloadLinks(release);
  const meta = resolveReleaseMeta(release);

  useEffect(() => {
    setPlatform(guessPlatform());
  }, []);

  return (
    <section id="download" className="relative px-5 py-24 md:py-36">
      <div className="mx-auto max-w-[1180px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <p className="label-tiny mb-2">
            <span className="text-foreground">Download</span>{" "}
            <span className="text-muted-foreground">Android &amp; iOS</span>
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={revealViewport}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <DuoMark size={40} />
          </motion.div>
          <motion.h2
            variants={revealUp}
            custom={0.08}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            className="mt-6 font-display text-[clamp(1.9rem,4.6vw,3.1rem)] leading-[1.08] tracking-[-0.01em]"
          >
            Your space is ready.
          </motion.h2>
          <motion.p
            variants={revealUp}
            custom={0.14}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            className="mt-3 text-[13.5px] text-muted-foreground max-w-sm"
          >
            Install DuoSpace on both phones, pair once, and the space is yours from then on.
          </motion.p>
        </div>

        <motion.div
          variants={revealUp}
          custom={0.1}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          className="tile relative p-4 md:p-5"
        >
          <div className="absolute inset-0 paper-grid opacity-50" aria-hidden />
          <div className="relative flex flex-col gap-2.5">
            <PlatformRow
              icon={Smartphone}
              label={links.androidApk.label}
              sublabel={links.androidApk.sublabel}
              url={links.androidApk.url}
              primary={platform !== "ios"}
            />
            <PlatformRow
              icon={Apple}
              label={links.appleAppStore.label}
              sublabel={links.appleAppStore.sublabel}
              url={links.appleAppStore.url}
              primary={platform === "ios"}
            />
            <PlatformRow
              icon={Globe}
              label={links.web.label}
              sublabel={links.web.sublabel}
              url={links.web.url}
            />
            <p className="mt-1 px-1 text-[11px] font-mono text-muted-foreground/70">
              DuoSpace v{meta.version}
              {meta.apkSizeMb ? ` · ${meta.apkSizeMb} MB` : ""}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
