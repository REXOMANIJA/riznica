"use client";

import { X, Filter } from "lucide-react";

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

export function GenreFilter({ genres, selectedGenre, onSelectGenre }: GenreFilterProps) {
  if (genres.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3 px-2">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest"
        style={{ color: "rgba(180,130,50,0.7)", fontFamily: "Georgia, serif" }}
      >
        <Filter className="h-3 w-3" />
        Filtriraj po žanru
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {/* Show all button */}
        <button
          onClick={() => onSelectGenre(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedGenre === null
              ? "ring-2"
              : ""
          }`}
          style={{
            background: selectedGenre === null
              ? "rgba(200,148,90,0.2)"
              : "rgba(200,148,90,0.08)",
            border: "1px solid rgba(200,148,90,0.3)",
            color: selectedGenre === null
              ? "#e8d4a0"
              : "rgba(200,148,90,0.7)",
            boxShadow: selectedGenre === null
              ? "0 0 20px rgba(200,148,90,0.15)"
              : "none",
          }}
          onMouseEnter={(e) => {
            if (selectedGenre !== null) {
              Object.assign(e.currentTarget.style, {
                background: "rgba(200,148,90,0.15)",
                borderColor: "rgba(200,148,90,0.5)",
                color: "rgba(224,184,100,1)",
              });
            }
          }}
          onMouseLeave={(e) => {
            if (selectedGenre !== null) {
              Object.assign(e.currentTarget.style, {
                background: "rgba(200,148,90,0.08)",
                borderColor: "rgba(200,148,90,0.3)",
                color: "rgba(200,148,90,0.7)",
              });
            }
          }}
        >
          Sve
        </button>

        {/* Genre buttons */}
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              selectedGenre === genre
                ? "ring-2"
                : ""
            }`}
            style={{
              background: selectedGenre === genre
                ? "rgba(200,148,90,0.2)"
                : "rgba(200,148,90,0.08)",
              border: "1px solid rgba(200,148,90,0.3)",
              color: selectedGenre === genre
                ? "#e8d4a0"
                : "rgba(200,148,90,0.7)",
              boxShadow: selectedGenre === genre
                ? "0 0 20px rgba(200,148,90,0.15)"
                : "none",
            }}
            onMouseEnter={(e) => {
              if (selectedGenre !== genre) {
                Object.assign(e.currentTarget.style, {
                  background: "rgba(200,148,90,0.15)",
                  borderColor: "rgba(200,148,90,0.5)",
                  color: "rgba(224,184,100,1)",
                });
              }
            }}
            onMouseLeave={(e) => {
              if (selectedGenre !== genre) {
                Object.assign(e.currentTarget.style, {
                  background: "rgba(200,148,90,0.08)",
                  borderColor: "rgba(200,148,90,0.3)",
                  color: "rgba(200,148,90,0.7)",
                });
              }
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Clear filter hint */}
      {selectedGenre && (
        <button
          onClick={() => onSelectGenre(null)}
          className="flex items-center gap-1 text-xs mt-1 hover:text-amber-400 transition-colors"
          style={{ color: "rgba(200,148,90,0.5)" }}
        >
          <X className="h-3 w-3" />
          Ukloni filter
        </button>
      )}
    </div>
  );
}
