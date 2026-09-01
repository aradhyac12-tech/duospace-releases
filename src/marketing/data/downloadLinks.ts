/**
 * Single source of truth for every "get the app" destination on the
 * marketing site. Never hardcode a store URL in a component — read it
 * from here, which reads from env.
 *
 * Unset variables resolve to `null`, and every consumer (DownloadCTA,
 * MarketingNav, PlatformButton) is expected to render "Coming soon"
 * rather than a dead or fabricated link when a value is null.
 */

import type { PublicRelease } from "@/lib/releases";

export type DownloadPlatform = "androidApk" | "googlePlay" | "appleAppStore" | "web";


export interface DownloadLinkMeta {
  url: string | null;
  label: string;
  sublabel: string;
}

const env = import.meta.env;

export const downloadLinks: Record<DownloadPlatform, DownloadLinkMeta> = {
  androidApk: {
    url: (env["VITE_DUOSPACE_APK_URL"] as string | undefined) || null,
    label: "Download APK",
    sublabel: "Android",
  },
  googlePlay: {
    url: (env["VITE_DUOSPACE_GOOGLE_PLAY_URL"] as string | undefined) || null,
    label: "Get it on Google Play",
    sublabel: "Android",
  },
  appleAppStore: {
    url: (env["VITE_DUOSPACE_APP_STORE_URL"] as string | undefined) || null,
    label: "Download on the App Store",
    sublabel: "iPhone & iPad",
  },
  web: {
    url: (env["VITE_DUOSPACE_WEB_URL"] as string | undefined) || null,
    label: "Open DuoSpace",
    sublabel: "Web",
  },
};

/** Optional, purely informational — never blocks a download if unset. */
export const releaseMeta = {
  version: (env["VITE_DUOSPACE_VERSION"] as string | undefined) || "3.2.0",
  apkSizeMb: (env["VITE_DUOSPACE_APK_SIZE_MB"] as string | undefined) || null,
};

/**
 * The published release from Lovable Cloud is the source of truth; env vars
 * remain the fallback so the site still renders before the first release is
 * published (and if the backend read fails).
 */
export function resolveDownloadLinks(
  release: PublicRelease | null | undefined,
): Record<DownloadPlatform, DownloadLinkMeta> {
  if (!release) return downloadLinks;
  return {
    androidApk: { ...downloadLinks.androidApk, url: release.apkUrl ?? downloadLinks.androidApk.url },
    googlePlay: { ...downloadLinks.googlePlay, url: release.googlePlayUrl ?? downloadLinks.googlePlay.url },
    appleAppStore: {
      ...downloadLinks.appleAppStore,
      url: release.appleAppStoreUrl ?? downloadLinks.appleAppStore.url,
    },
    web: { ...downloadLinks.web, url: release.webUrl ?? downloadLinks.web.url },
  };
}

export function resolveReleaseMeta(release: PublicRelease | null | undefined) {
  if (!release) return releaseMeta;
  return {
    version: release.version || releaseMeta.version,
    apkSizeMb: release.apkSizeBytes
      ? (release.apkSizeBytes / (1024 * 1024)).toFixed(1)
      : releaseMeta.apkSizeMb,
  };
}


export type PlatformGuess = "android" | "ios" | "desktop";

/** Best-effort client detection so the primary CTA matches the visitor's device. */
export function guessPlatform(): PlatformGuess {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  // iPadOS 13+ reports as Mac — disambiguate via touch support.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return "desktop";
}
