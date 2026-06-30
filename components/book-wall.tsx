"use client";

import React, { useState } from "react";
import { BookCard, EmptyBook } from "@/components/book-card";
import { StoryModal } from "@/components/story-modal";
import type { Story } from "@/lib/database.types";

const COLS        = 6;
const SIDE_W      = 32;

interface BookWallProps {
  stories: Story[];
  selectedGenre?: string | null;
  rows: number;
}

export function BookWall({ stories, selectedGenre, rows }: BookWallProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const TOTAL_SLOTS = COLS * rows;

  const slotMap = new Map<number, Story>();
  stories.forEach((s) => {
    const slot = Math.max(0, Math.min(s.shelf_order, TOTAL_SLOTS - 1));
    slotMap.set(slot, s);
  });

  const allSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
    slotIdx: i,
    story: slotMap.get(i) ?? null,
  }));

  return (
    <>
      {/* ── No horizontal scroll — bookcase stretches to fit ── */}
      <div className="px-1 sm:px-3 md:px-6">

        {/* ════════════════════════════
            OUTER BOOKCASE FRAME
            --sw CSS var = side-panel width, scales with viewport
        ════════════════════════════ */}
        <div
          className="bookcase-frame rounded-sm select-none"
          style={{
            ["--sw" as string]: "clamp(12px, 3.5vw, 32px)",
            padding: "0 var(--sw)",
          } as React.CSSProperties}
        >
          {/* ── Crown trim ── */}
          <div
            className="bookcase-top-trim rounded-t-sm h-[5px] sm:h-[6px]"
            style={{ marginLeft: "calc(-1 * var(--sw))", width: "calc(100% + 2 * var(--sw))" }}
          />

          {/* ── Top beam ── */}
          <div
            className="bookcase-top-beam h-8 sm:h-12 flex items-center justify-center relative"
            style={{ marginLeft: "calc(-1 * var(--sw))", width: "calc(100% + 2 * var(--sw))" }}
          >
            <div className="absolute inset-x-8 sm:inset-x-14 inset-y-1.5 sm:inset-y-2 rounded-sm"
              style={{ background: "linear-gradient(to bottom, rgba(255,180,60,0.06), rgba(0,0,0,0.2))", border: "1px solid rgba(255,160,40,0.08)" }} />
            <div className="absolute left-3 sm:left-7 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-5 sm:h-5 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,180,60,0.25) 0%, rgba(120,70,20,0.18) 60%, transparent 100%)", border: "1px solid rgba(255,160,40,0.18)" }} />
            <div className="absolute right-3 sm:right-7 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-5 sm:h-5 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,180,60,0.25) 0%, rgba(120,70,20,0.18) 60%, transparent 100%)", border: "1px solid rgba(255,160,40,0.18)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,180,60,0.22), transparent)" }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(255,180,60,0.15), transparent)" }} />
          </div>

          <div
            className="bookcase-top-trim h-[3px] sm:h-[4px]"
            style={{ marginLeft: "calc(-1 * var(--sw))", width: "calc(100% + 2 * var(--sw))" }}
          />

          {/* ── Main content: side panels + grid ── */}
          <div
            className="flex"
            style={{ marginLeft: "calc(-1 * var(--sw))", width: "calc(100% + 2 * var(--sw))" }}
          >
            {/* Left side panel */}
            <div className="bookcase-side shrink-0 relative" style={{ width: "var(--sw)" }}>
              <div className="absolute inset-y-0 left-[45%] w-px"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(255,160,40,0.07), transparent)" }} />
            </div>

            {/* Cubbyhole grid */}
            <div className="flex-1 p-1.5 sm:p-3 md:p-4" style={{ overflow: "visible" }}>
              {/* Candle ambient glow across whole grid */}
              <div className="relative" style={{ overflow: "visible" }}>
                <div
                  className="candle-flicker pointer-events-none absolute -top-8 left-0 right-0 h-24 z-0"
                  style={{
                    background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,150,30,0.07) 0%, transparent 70%)",
                  }}
                />

                {/* ── Responsive grid: 3 cols mobile / 4 tablet / 6 desktop ── */}
                <div
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-[5px] sm:gap-[7px] md:gap-[10px] relative z-10"
                  style={{ overflow: "visible" }}
                >
                  {allSlots.map(({ slotIdx, story }) => (
                    <div
                      key={slotIdx}
                      className={`cubby-cell rounded-[3px] p-1 sm:p-1.5 relative transition-opacity duration-300 ${
                        selectedGenre && story && story.genre !== selectedGenre
                          ? "opacity-30"
                          : ""
                      }`}
                      style={{ aspectRatio: "3/4", overflow: "visible" }}
                    >
                      {/* Candle glow for occupied slots */}
                      {story && (
                        <div
                          className="absolute inset-0 rounded-[3px] pointer-events-none z-0"
                          style={{
                            background: "radial-gradient(ellipse at 50% 110%, rgba(255,140,20,0.08), transparent 70%)",
                            boxShadow: "inset 0 0 12px rgba(255,130,10,0.04)",
                          }}
                        />
                      )}
                      <div className="relative w-full h-full z-10" style={{ overflow: "visible" }}>
                        {story ? (
                          <BookCard
                            story={story}
                            index={slotIdx}
                            onClick={() => setSelectedStory(story)}
                          />
                        ) : (
                          <EmptyBook index={slotIdx} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side panel */}
            <div className="bookcase-side-right shrink-0 relative" style={{ width: "var(--sw)" }}>
              <div className="absolute inset-y-0 right-[45%] w-px"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(255,160,40,0.07), transparent)" }} />
            </div>
          </div>

          {/* ── Base plinth ── */}
          <div
            className="bookcase-top-trim h-[3px] sm:h-[4px]"
            style={{ marginLeft: "calc(-1 * var(--sw))", width: "calc(100% + 2 * var(--sw))" }}
          />
          <div
            className="bookcase-base h-5 sm:h-7 rounded-b-sm"
            style={{ marginLeft: "calc(-1 * var(--sw))", width: "calc(100% + 2 * var(--sw))" }}
          />
        </div>
      </div>

      <StoryModal
        story={selectedStory}
        open={!!selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </>
  );
}
