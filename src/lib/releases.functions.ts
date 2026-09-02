import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import type { PublicRelease } from "@/lib/releases";

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24; // 24h; refreshed on every load

/**
 * Public, unauthenticated read of the single published release.
 * Uses the publishable key (anon RLS), never the service role.
 */
export const getPublishedRelease = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicRelease | null> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return null;

    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data, error } = await supabase
      .from("app_releases")
      .select(
        "version, build_number, apk_storage_path, apk_filename, apk_size_bytes, google_play_url, apple_app_store_url, web_url, ipa_url, ipa_label, published_at",
      )
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return null;

    let apkUrl: string | null = null;
    if (data.apk_storage_path) {
      const signed = await supabase.storage
        .from("duospace-releases")
        .createSignedUrl(data.apk_storage_path, SIGNED_URL_TTL_SECONDS, {
          download: data.apk_filename ?? true,
        });
      apkUrl = signed.data?.signedUrl ?? null;
    }

    return {
      version: data.version,
      buildNumber: data.build_number,
      apkUrl,
      apkFilename: data.apk_filename,
      apkSizeBytes: data.apk_size_bytes,
      googlePlayUrl: data.google_play_url,
      appleAppStoreUrl: data.apple_app_store_url,
      webUrl: data.web_url,
      ipaUrl: data.ipa_url,
      ipaLabel: data.ipa_label,
      publishedAt: data.published_at,
    };
  },
);
