import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  apkStoragePath,
  formatBytes,
  releaseFormSchema,
  sha256Hex,
  validateApkFile,
  type AdminRelease,
  type ReleaseFormValues,
} from "@/lib/releases";

export const Route = createFileRoute("/_authenticated/admin/releases")({
  head: () => ({
    meta: [
      { title: "Release manager — DuoSpace" },
      { name: "description", content: "Upload and publish DuoSpace app releases." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Release manager — DuoSpace" },
      { property: "og:description", content: "Upload and publish DuoSpace app releases." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReleaseManager,
});

const BUCKET = "duospace-releases";

const emptyForm: Record<keyof ReleaseFormValues, string> = {
  version: "",
  build_number: "",
  release_notes: "",
  google_play_url: "",
  apple_app_store_url: "",
  web_url: "",
  ipa_url: "",
  ipa_label: "",
};

function ReleaseManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [busy, setBusy] = useState(false);

  const isAdminQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) throw error;
      return data === true;
    },
  });

  const releasesQuery = useQuery({
    queryKey: ["admin-releases"],
    enabled: isAdminQuery.data === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_releases")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as AdminRelease[];
    },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-releases"] });
    void queryClient.invalidateQueries({ queryKey: ["published-release"] });
  };

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("publish_release", { _release_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Release published");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const unpublishMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("unpublish_release", { _release_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Release archived");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (release: AdminRelease) => {
      if (release.apk_storage_path) {
        await supabase.storage.from(BUCKET).remove([release.apk_storage_path]);
      }
      const { error } = await supabase.from("app_releases").delete().eq("id", release.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Release deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function onFileChange(selected: File | null) {
    setFile(null);
    setFileError(null);
    if (!selected) return;
    const problem = await validateApkFile(selected);
    if (problem) {
      setFileError(problem);
      return;
    }
    setFile(selected);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFile(null);
    setFileError(null);
    setErrors({});
  }

  function startEdit(release: AdminRelease) {
    setEditingId(release.id);
    setFile(null);
    setFileError(null);
    setErrors({});
    setForm({
      version: release.version,
      build_number: release.build_number?.toString() ?? "",
      release_notes: release.release_notes ?? "",
      google_play_url: release.google_play_url ?? "",
      apple_app_store_url: release.apple_app_store_url ?? "",
      web_url: release.web_url ?? "",
      ipa_url: release.ipa_url ?? "",
      ipa_label: release.ipa_label ?? "",
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const parsed = releaseFormSchema.safeParse({
      version: form.version,
      build_number: form.build_number || undefined,
      release_notes: form.release_notes || undefined,
      google_play_url: form.google_play_url || undefined,
      apple_app_store_url: form.apple_app_store_url || undefined,
      web_url: form.web_url || undefined,
      ipa_url: form.ipa_url || undefined,
      ipa_label: form.ipa_label || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const values = parsed.data;
    const buildNumber = values.build_number ? Number(values.build_number) : null;

    setBusy(true);
    try {
      let apkFields: Partial<AdminRelease> = {};

      if (file) {
        const path = apkStoragePath(values.version, buildNumber, file.name);
        toast.info("Uploading APK…");
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: true, contentType: "application/vnd.android.package-archive" });
        if (uploadError) throw uploadError;
        const checksum = await sha256Hex(file);
        apkFields = {
          apk_storage_path: path,
          apk_filename: file.name,
          apk_size_bytes: file.size,
          apk_sha256: checksum,
        };
      }

      const payload = {
        version: values.version,
        build_number: buildNumber,
        release_notes: values.release_notes ?? null,
        google_play_url: values.google_play_url ?? null,
        apple_app_store_url: values.apple_app_store_url ?? null,
        web_url: values.web_url ?? null,
        ipa_url: values.ipa_url ?? null,
        ipa_label: values.ipa_label ?? null,
        ...apkFields,
      };

      if (editingId) {
        const { error } = await supabase.from("app_releases").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Release updated");
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
          .from("app_releases")
          .insert({ ...payload, created_by: userData.user?.id ?? null });
        if (error) throw error;
        toast.success("Draft release created");
      }

      resetForm();
      invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (isAdminQuery.isLoading) {
    return <p className="p-10 text-sm text-muted-foreground">Checking permissions…</p>;
  }

  if (isAdminQuery.data !== true) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h1 className="font-heading text-xl font-semibold">Admins only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account doesn't have release-management access.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/auth" });
            }}
          >
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  const releases = releasesQuery.data ?? [];

  return (
    <main className="min-h-screen bg-background px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              DuoSpace admin
            </p>
            <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">Release manager</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut();
              queryClient.clear();
              void navigate({ to: "/auth" });
            }}
          >
            Sign out
          </Button>
        </header>

        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-pop)]"
        >
          <h2 className="font-heading text-lg font-semibold">
            {editingId ? "Edit release" : "New release"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Version" error={errors["version"]}>
              <Input
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="3.2.0"
                maxLength={40}
                required
              />
            </Field>
            <Field label="Build number" error={errors["build_number"]}>
              <Input
                value={form.build_number}
                onChange={(e) => setForm({ ...form, build_number: e.target.value })}
                placeholder="320"
                inputMode="numeric"
                maxLength={9}
              />
            </Field>
          </div>

          <Field label="Release notes" error={errors["release_notes"]}>
            <Textarea
              value={form.release_notes}
              onChange={(e) => setForm({ ...form, release_notes: e.target.value })}
              rows={4}
              maxLength={4000}
              placeholder="What changed in this build?"
            />
          </Field>

          <Field label="APK file" error={fileError ?? undefined}>
            <Input
              type="file"
              accept=".apk,application/vnd.android.package-archive"
              onChange={(e) => void onFileChange(e.target.files?.[0] ?? null)}
            />
            {file && (
              <p className="mt-1 text-xs text-muted-foreground">
                {file.name} · {formatBytes(file.size)}
              </p>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Google Play URL" error={errors["google_play_url"]}>
              <Input
                value={form.google_play_url}
                onChange={(e) => setForm({ ...form, google_play_url: e.target.value })}
                placeholder="https://play.google.com/store/apps/details?id=…"
              />
            </Field>
            <Field label="App Store URL" error={errors["apple_app_store_url"]}>
              <Input
                value={form.apple_app_store_url}
                onChange={(e) => setForm({ ...form, apple_app_store_url: e.target.value })}
                placeholder="https://apps.apple.com/app/…"
              />
            </Field>
            <Field label="Web app URL" error={errors["web_url"]}>
              <Input
                value={form.web_url}
                onChange={(e) => setForm({ ...form, web_url: e.target.value })}
                placeholder="https://app.duospace.com"
              />
            </Field>
            <Field label="IPA / TestFlight URL" error={errors["ipa_url"]}>
              <Input
                value={form.ipa_url}
                onChange={(e) => setForm({ ...form, ipa_url: e.target.value })}
                placeholder="https://testflight.apple.com/join/…"
              />
            </Field>
          </div>

          <Field label="IPA label (internal)" error={errors["ipa_label"]}>
            <Input
              value={form.ipa_label}
              onChange={(e) => setForm({ ...form, ipa_label: e.target.value })}
              placeholder="TestFlight beta"
              maxLength={80}
            />
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : editingId ? "Save changes" : "Create draft"}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm} disabled={busy}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <section className="mt-12">
          <h2 className="font-heading text-lg font-semibold">Releases</h2>
          {releasesQuery.isLoading && (
            <p className="mt-3 text-sm text-muted-foreground">Loading releases…</p>
          )}
          {!releasesQuery.isLoading && releases.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">No releases yet.</p>
          )}

          <ul className="mt-4 space-y-3">
            {releases.map((release) => (
              <li key={release.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-heading text-base font-semibold">
                    v{release.version}
                    {release.build_number ? ` (${release.build_number})` : ""}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                      release.status === "published"
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {release.status}
                  </span>
                  {release.apk_filename && (
                    <span className="text-xs text-muted-foreground">
                      {release.apk_filename} · {formatBytes(release.apk_size_bytes)}
                    </span>
                  )}
                </div>

                {release.apk_sha256 && (
                  <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground/80">
                    sha256 {release.apk_sha256}
                  </p>
                )}
                {release.release_notes && (
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                    {release.release_notes}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {release.status === "published" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unpublishMutation.mutate(release.id)}
                      disabled={unpublishMutation.isPending}
                    >
                      Archive
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => publishMutation.mutate(release.id)}
                      disabled={publishMutation.isPending}
                    >
                      Publish
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => startEdit(release)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      if (window.confirm(`Delete release v${release.version}?`)) {
                        deleteMutation.mutate(release);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
