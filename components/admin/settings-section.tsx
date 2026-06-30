"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const SLOTS_PER_ROW = 6;

interface SettingsSectionProps {
  onSettingsChange?: (rows: number) => void;
}

export function SettingsSection({ onSettingsChange }: SettingsSectionProps) {
  const [rows, setRows] = useState(16);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "bookshelf_rows")
      .single();
    
    if (data?.value) {
      setRows(parseInt(data.value, 10));
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from("settings")
      .upsert({
        key: "bookshelf_rows",
        value: rows.toString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "key"
      });

    if (error) {
      console.error("Failed to save settings:", error.message);
    } else {
      onSettingsChange?.(rows);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <section className="bg-stone-900 border border-stone-700 rounded-xl p-5 shadow-xl">
      <h2 className="text-stone-200 font-semibold text-base mb-4">
        Postavke police
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="rows">Broj redova</Label>
          <Input
            id="rows"
            type="number"
            min="1"
            max="50"
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value, 10) || 1)}
            className="w-24"
          />
          <p className="text-stone-500 text-xs">
            Ukupno mesta: {rows * SLOTS_PER_ROW}
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Čuvam...
            </>
          ) : (
            "Sačuvaj"
          )}
        </Button>
      </div>
    </section>
  );
}
