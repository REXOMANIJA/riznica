"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookLock, Loader2 } from "lucide-react";

export default function RexLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Pogrešna e-mail adresa ili lozinka.");
      setLoading(false);
      return;
    }

    router.push("/rex/panel");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[hsl(20,14%,8%)] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-900/30 border border-amber-700/40 mb-4">
            <BookLock className="h-7 w-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-amber-400 font-serif">
            Adminski pristup
          </h1>
          <p className="text-stone-500 text-sm mt-1">Vanjina Riznica Priča</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-stone-900 border border-stone-700 rounded-xl p-6 space-y-5 shadow-xl"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="vanja@primjer.hr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Lozinka</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Prijava"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
