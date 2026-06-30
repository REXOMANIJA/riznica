import { createClient } from "@/lib/supabase";
import { BookshelfWithFilter } from "@/components/bookshelf-with-filter";
import { FeaturedStoryCard } from "@/components/featured-story-card";
import { AdminLink } from "@/components/admin-link";
import type { Story } from "@/lib/database.types";
import { BookOpen } from "lucide-react";

async function getStories(): Promise<Story[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("is_published", true)
    .order("shelf_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch stories:", error.message);
    return [];
  }
  return data || [];
}

async function getBookshelfRows(): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "bookshelf_rows")
    .single();
  
  return data?.value ? parseInt(data.value, 10) : 16;
}

export const revalidate = 0;

export default async function HomePage() {
  const stories = await getStories();
  const bookshelfRows = await getBookshelfRows();

  // Find the most recent story by created_at for featured card
  const featuredStory = stories.length > 0
    ? stories.reduce((latest, story) =>
        new Date(story.created_at) > new Date(latest.created_at) ? story : latest
      )
    : null;

  return (
    <main className="min-h-screen bg-[hsl(20,14%,8%)]">
      {/* Hero */}
      <div
        className="relative flex flex-col items-center justify-center pt-16 pb-12 px-4 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, hsl(35 80% 20% / 0.35) 0%, transparent 65%)",
        }}
      >
        {/* Decorative top line */}
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-amber-700/60 to-transparent mb-8" />

        {/* Ornamental crown */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-600/40" />
          <div className="flex items-center gap-2" style={{ color: "rgba(200,148,90,0.7)" }}>
            <span style={{ fontSize: "22px", lineHeight: 1 }}>⁓</span>
            <span style={{ fontSize: "28px", lineHeight: 1 }}>✦</span>
            <span style={{ fontSize: "22px", lineHeight: 1 }}>⁓</span>
          </div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-600/40" />
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold text-amber-400 font-serif tracking-tight"
          style={{ textShadow: "0 2px 30px hsl(35 80% 40% / 0.4)" }}
        >
          Vanjina Riznica Priča
        </h1>

        <p className="mt-4 text-stone-400 text-base md:text-lg max-w-lg leading-relaxed">
          Ja kad pisanje i... priče... <br />
          I tako...
        </p>

        

        <div className="mt-8 w-40 h-px bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
      </div>
      
      {/* ── Featured story spotlight ── */}
      {featuredStory && (
        <FeaturedStoryCard story={featuredStory} />
      )}

      {/* ── Atmospheric section divider ── */}
      <div className="flex items-center justify-center gap-4 px-4 py-6">
        <div className="flex-1 max-w-[120px] h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(180,120,40,0.45))" }} />
        <div
          className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium select-none"
          style={{ color: "rgba(180,130,50,0.7)", fontFamily: "Georgia, serif", letterSpacing: "0.22em" }}
        >
          <span style={{ fontSize: "10px", opacity: 0.6 }}>✦</span>
          Polica sa pričama
          <span style={{ fontSize: "10px", opacity: 0.6 }}>✦</span>
        </div>
        <div className="flex-1 max-w-[120px] h-px"
          style={{ background: "linear-gradient(to left, transparent, rgba(180,120,40,0.45))" }} />
      </div>

      

      {/* Bookshelf with filter */}
      {stories.length === 0 ? (
        <section className="max-w-7xl mx-auto pb-16 px-2">
          <div className="text-center py-24 text-stone-700">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-serif">Polica je još prazna…</p>
            <p className="text-sm mt-2 text-stone-800">
              Priče dolaze uskoro.
            </p>
          </div>
        </section>
      ) : (
        <BookshelfWithFilter stories={stories} rows={bookshelfRows} />
      )}

      {/* ── Quote section ── */}
      

      {/* Footer */}
      <footer className="text-center pb-8 text-stone-800 text-xs">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent mx-auto mb-4" />
        Vanjina Riznica Priča · sve priče su moje
      </footer>
      <AdminLink />
    </main>
  );
}
