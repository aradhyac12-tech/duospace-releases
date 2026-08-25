import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TITLE = "Admin sign in — DuoSpace";
const DESCRIPTION = "Restricted sign-in for the DuoSpace release manager.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password is too long" }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "bootstrap">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (active && data.session) void navigate({ to: "/admin/releases" });
    })();
    void (async () => {
      const { data } = await supabase.rpc("admin_exists");
      if (active) {
        const exists = data !== false;
        setAdminExists(exists);
        if (!exists) setMode("bootstrap");
      }
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid credentials");
      return;
    }

    setBusy(true);
    try {
      if (mode === "bootstrap") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin/releases` },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);
        if (signInError) {
          setNotice("Account created. Confirm your email, then sign in.");
          setMode("signin");
          return;
        }
        void navigate({ to: "/admin/releases" });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword(parsed.data);
      if (signInError) {
        setError("Incorrect email or password.");
        return;
      }
      void navigate({ to: "/admin/releases" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-pop)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          DuoSpace
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground">
          {mode === "bootstrap" ? "Create the admin account" : "Admin sign in"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "bootstrap"
            ? "No admin exists yet. The first account created becomes the release manager."
            : "Release management is restricted to the DuoSpace admin."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "bootstrap" ? "new-password" : "current-password"}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {notice && <p className="text-sm text-muted-foreground">{notice}</p>}

          <Button type="submit" className="w-full" disabled={busy || adminExists === null}>
            {busy ? "Please wait…" : mode === "bootstrap" ? "Create admin account" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
