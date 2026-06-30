"use client";

import { useState, useEffect } from "react";
import { BookWall } from "@/components/book-wall";
import { GenreFilter } from "@/components/genre-filter";
import { createClient } from "@/lib/supabase";
import type { Story } from "@/lib/database.types";

interface BookshelfWithFilterProps {
  stories: Story[];
  rows: number;
}

export function BookshelfWithFilter({ stories, rows: initialRows }: BookshelfWithFilterProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [rows, setRows] = useState(initialRows);

  useEffect(() => {
    async function fetchRows() {
      const supabase = createClient();
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "bookshelf_rows")
        .single();
      if (data?.value) {
        setRows(parseInt(data.value, 10));
      }
    }
    fetchRows();
  }, []);

  const genres = [...new Set(stories.map((s) => s.genre).filter((g): g is string => g !== null))].sort();

  return (
    <section className="max-w-7xl mx-auto pb-16 px-2">
      {/* Genre filter */}
      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
      />

      {/* Bookshelf */}
      <div className="mt-6">
        <BookWall stories={stories} selectedGenre={selectedGenre} rows={rows} />
      </div>
    </section>
  );
}
