"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { StoryForm } from "@/components/admin/story-form";
import { StoryList } from "@/components/admin/story-list";
import { LogoutButton } from "@/components/admin/logout-button";
import { SettingsSection } from "@/components/admin/settings-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookMarked, Plus, X, Loader2, BookOpen, Eye, EyeOff, Tag, ArrowLeft } from "lucide-react";
import type { Story } from "@/lib/database.types";

export default function AdminPanelPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [bookshelfRows, setBookshelfRows] = useState(16);

  const fetchStories = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/rex");
      return;
    }

    const { data } = await supabase
      .from("stories")
      .select("*")
      .order("shelf_order", { ascending: true });

    setStories(data || []);
    setLoading(false);
  }, [router]);

  const fetchSettings = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "bookshelf_rows")
      .single();
    
    if (data?.value) {
      setBookshelfRows(parseInt(data.value, 10));
    }
  }, []);

  useEffect(() => {
    fetchStories();
    fetchSettings();
  }, [fetchStories, fetchSettings]);

  function handleEdit(story: Story) {
    setEditingStory(story);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingStory(null);
    fetchStories();
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditingStory(null);
  }

  function handleSettingsChange(rows: number) {
    setBookshelfRows(rows);
    router.refresh();
  }

  const occupiedSlots = stories
    .filter((s) => !editingStory || s.id !== editingStory.id)
    .map((s) => s.shelf_order);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[hsl(20,14%,8%)]">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[hsl(20,14%,8%)]">
      <header className="sticky top-0 z-10 border-b border-stone-800 bg-stone-900/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-stone-500 hover:text-amber-400 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Glavna</span>
          </Link>
          <div className="w-px h-5 bg-stone-700" />
          <div className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-amber-400" />
            <h1 className="text-amber-400 font-serif font-bold text-lg">Admin Panel</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showForm && !editingStory ? "outline" : "default"}
            onClick={() => {
              if (showForm && !editingStory) {
                setShowForm(false);
              } else {
                setEditingStory(null);
                setShowForm(true);
              }
            }}
          >
            {showForm && !editingStory ? (
              <>
                <X className="h-4 w-4 mr-1" />
                Zatvori
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Nova priča
              </>
            )}
          </Button>
          <LogoutButton />
        </div>
      </header>

      {/* ── Stats dashboard ── */}
      {!loading && (
        <div className="border-b border-stone-800 bg-stone-900/40">
          <div className="max-w-2xl mx-auto px-4 py-3 grid grid-cols-4 gap-2">
            {[
              { icon: <BookOpen className="h-3.5 w-3.5" />, value: stories.length, label: "Ukupno" },
              { icon: <Eye className="h-3.5 w-3.5" />,      value: stories.filter(s => s.is_published).length,  label: "Objavljeno" },
              { icon: <EyeOff className="h-3.5 w-3.5" />,   value: stories.filter(s => !s.is_published).length, label: "Skriveno" },
              { icon: <Tag className="h-3.5 w-3.5" />,       value: new Set(stories.map(s => s.genre).filter(Boolean)).size, label: "Žanrova" },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5 py-2 rounded-lg bg-stone-800/40 border border-stone-800">
                <div className="flex items-center gap-1.5 text-amber-500/70">{icon}</div>
                <span className="text-amber-400 font-bold font-serif text-lg leading-none">{value}</span>
                <span className="text-stone-600 text-[10px] uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <SettingsSection onSettingsChange={handleSettingsChange} />

        {showForm && (
          <section className="bg-stone-900 border border-stone-700 rounded-xl p-5 shadow-xl">
            <h2 className="text-stone-200 font-semibold text-base mb-4">
              {editingStory ? "Uredi priču" : "Dodaj novu priču"}
            </h2>
            <StoryForm
              key={editingStory?.id ?? "new"}
              story={editingStory ?? undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
              occupiedSlots={occupiedSlots}
              rows={bookshelfRows}
            />
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-stone-300 font-semibold text-sm uppercase tracking-widest">
              Priče na polici ({stories.length})
            </h2>
          </div>
          <StoryList
            stories={stories}
            onEdit={handleEdit}
            onRefresh={fetchStories}
          />
        </section>
      </div>
    </main>
  );
}
