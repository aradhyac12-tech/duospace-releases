import { z } from "zod";

/** Shape the public marketing site is allowed to see. No internal metadata. */
export interface PublicRelease {
  version: string;
  buildNumber: number | null;
  apkUrl: string | null;
  apkFilename: string | null;
  apkSizeBytes: number | null;
  googlePlayUrl: string | null;
  appleAppStoreUrl: string | null;
  webUrl: string | null;
  publishedAt: string | null;
}

export type ReleaseStatus = "draft" | "published" | "archived";

/** Full admin-side row (mirrors public.app_releases). */
export interface AdminRelease {
  id: string;
  version: string;
  build_number: number | null;
  release_notes: string | null;
  apk_storage_path: string | null;
  apk_filename: string | null;
  apk_size_bytes: number | null;
  apk_sha256: string | null;
  google_play_url: string | null;
  apple_app_store_url: string | null;
  ipa_url: string | null;
  ipa_label: string | null;
  web_url: string | null;
  status: ReleaseStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

/* ------------------------------------------------------------------ */
/* URL validation                                                      */
/* ------------------------------------------------------------------ */

const BLOCKED_SCHEMES = ["javascript:", "data:", "file:", "vbscript:", "blob:"];

/** Only ever https. Explicitly rejects javascript:/data:/file: payloads. */
export function parseHttpsUrl(value: string): URL | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (BLOCKED_SCHEMES.includes(url.protocol.toLowerCase())) return null;
  if (url.protocol !== "https:") return null;
  return url;
}

function hostMatches(url: URL, domain: string) {
  const host = url.hostname.toLowerCase();
  return host === domain || host.endsWith(`.${domain}`);
}

const optionalUrl = (check: (url: URL) => boolean, message: string) =>
  z
    .string()
    .trim()
    .max(2048, { message: "URL is too long" })
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => {
      if (!v) return true;
      const url = parseHttpsUrl(v);
      return url !== null && check(url);
    }, { message });

export const releaseFormSchema = z.object({
  version: z
    .string()
    .trim()
    .min(1, { message: "Version is required" })
    .max(40, { message: "Version is too long" })
    .regex(/^[0-9A-Za-z.\-+]+$/, { message: "Use digits, letters, dots or dashes (e.g. 1.2.0)" }),
  build_number: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || /^\d{1,9}$/.test(v), { message: "Build must be a whole number" }),
  release_notes: z.string().trim().max(4000, { message: "Release notes are too long" }).optional(),
  google_play_url: optionalUrl(
    (u) => hostMatches(u, "play.google.com"),
    "Must be an https link on play.google.com",
  ),
  apple_app_store_url: optionalUrl(
    (u) => hostMatches(u, "apps.apple.com"),
    "Must be an https link on apps.apple.com",
  ),
  web_url: optionalUrl(() => true, "Must be an https:// URL"),
  ipa_url: optionalUrl(() => true, "Must be an https:// URL"),
  ipa_label: z.string().trim().max(80, { message: "Label is too long" }).optional(),
});

export type ReleaseFormValues = z.infer<typeof releaseFormSchema>;

/* ------------------------------------------------------------------ */
/* APK validation + helpers                                            */
/* ------------------------------------------------------------------ */

export const MAX_APK_BYTES = 500 * 1024 * 1024; // matches the storage bucket limit

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "—";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Validates the selected file before any upload happens: extension, MIME
 * where the browser supplies one, size, and the ZIP magic bytes every real
 * APK starts with (an APK is a signed ZIP container).
 */
export async function validateApkFile(file: File): Promise<string | null> {
  if (!/\.apk$/i.test(file.name)) return "File must have a .apk extension";
  if (file.name.length > 200) return "Filename is too long";
  const type = file.type?.toLowerCase() ?? "";
  const allowedTypes = [
    "",
    "application/vnd.android.package-archive",
    "application/octet-stream",
    "application/zip",
    "application/x-zip-compressed",
  ];
  if (!allowedTypes.includes(type)) return `Unexpected file type: ${type}`;
  if (file.size <= 0) return "File is empty";
  if (file.size > MAX_APK_BYTES) {
    return `File is ${formatBytes(file.size)} — the limit is ${formatBytes(MAX_APK_BYTES)}`;
  }
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const isZip = head[0] === 0x50 && head[1] === 0x4b && (head[2] === 0x03 || head[2] === 0x05 || head[2] === 0x07);
  if (!isZip) return "This file is not a valid APK (missing ZIP signature)";
  return null;
}

/** Deterministic, auditable storage path — never a single "latest.apk". */
export function apkStoragePath(version: string, buildNumber: number | null, filename: string) {
  const safeVersion = version.replace(/[^0-9A-Za-z.\-+]/g, "_");
  const safeName = filename.replace(/[^0-9A-Za-z.\-_]/g, "_");
  const buildSegment = buildNumber ? `build-${buildNumber}` : "build-na";
  return `releases/${safeVersion}/${buildSegment}/${safeName}`;
}

export async function sha256Hex(file: File): Promise<string | null> {
  if (typeof crypto === "undefined" || !crypto.subtle) return null;
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
