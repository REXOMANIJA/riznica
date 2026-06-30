"use client";

import { useState } from "react";
import { BookOpen, Feather, ArrowRight } from "lucide-react";
import { StoryModal } from "@/components/story-modal";
import type { Story } from "@/lib/database.types";

const leatherColors = [
  { bg: "#5c1a1a", bgMid: "#4a1414", text: "#e8c89a", accent: "#c8945a" },
  { bg: "#1a3d2e", bgMid: "#163325", text: "#a8d4b8", accent: "#70b890" },
  { bg: "#1a2a4a", bgMid: "#15223d", text: "#9ab4d8", accent: "#6890c0" },
  { bg: "#3d2210", bgMid: "#32180a", text: "#e0b880", accent: "#c09050" },
  { bg: "#2d1a40", bgMid: "#241535", text: "#c4a8e0", accent: "#9870c8" },
  { bg: "#3a1a0a", bgMid: "#2e1408", text: "#e8c080", accent: "#c89840" },
  { bg: "#1a3a3a", bgMid: "#143030", text: "#90d0c8", accent: "#60b0a8" },
  { bg: "#3a1a2a", bgMid: "#2e1422", text: "#e0a0c0", accent: "#c07090" },
];

interface FeaturedStoryCardProps {
  story: Story;
}

export function FeaturedStoryCard({ story }: FeaturedStoryCardProps) {
  const [open, setOpen] = useState(false);
  const color = leatherColors[typeof story.cover_color === 'number' ? story.cover_color : 0];
  const year  = story.written_date ? new Date(story.written_date).getFullYear() : null;
  const excerpt = story.content
    ? story.content.replace(/[#*_`>~\[\]]/g, "").trim().slice(0, 180).trimEnd() + "…"
    : null;

  return (
    <>
      <div
        className="max-w-2xl mx-auto mb-10 px-2"
        style={{ overflow: "visible" }}
      >
        {/* Card */}
        <div
          className="relative rounded-sm overflow-hidden cursor-pointer group"
          onClick={() => setOpen(true)}
          style={{
            background: "linear-gradient(135deg, #1a1008 0%, #231508 60%, #1a1008 100%)",
            border:     "1px solid rgba(200,148,90,0.22)",
            boxShadow:  "0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.4), inset 0 0 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Candle-glow vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 90% at 20% 50%, rgba(200,148,90,0.07) 0%, transparent 65%)",
            }}
          />

          {/* Top accent rule */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(200,148,90,0.4), transparent)" }}
          />

          <div className="flex items-stretch">
            {/* ── Book cover swatch ── */}
            <div
              className="shrink-0 relative"
              style={{ width: "110px" }}
            >
              {story.cover_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={story.cover_image_url}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  style={{ minHeight: "140px" }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    minHeight: "140px",
                    background: `linear-gradient(150deg, ${color.bg}ff 0%, ${color.bgMid}ff 50%, ${color.bg}ee 100%)`,
                  }}
                >
                  {/* Decorative cover ornament */}
                  <div className="flex flex-col items-center gap-2">
                    <div style={{ width: "40px", height: "40px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        border: `1px solid ${color.accent}55`,
                        transform: "rotate(45deg)",
                        borderRadius: "2px",
                      }} />
                      <BookOpen
                        style={{ width: "16px", height: "16px", color: `${color.accent}` }}
                      />
                    </div>
                    <div style={{
                      width: "50px", height: "1px",
                      background: `linear-gradient(to right, transparent, ${color.accent}55, transparent)`,
                    }} />
                  </div>

                  {/* Left binding */}
                  <div className="absolute top-0 bottom-0 left-0 w-[5px]"
                    style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5), transparent)" }} />
                  {/* Top gilt */}
                  <div className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: "linear-gradient(to bottom, rgba(255,215,80,0.6), transparent)" }} />
                  {/* Border frame */}
                  <div className="absolute rounded-[1px]"
                    style={{ top: "8%", left: "8%", right: "8%", bottom: "8%", border: `1px solid ${color.accent}45` }} />
                </div>
              )}
              {/* Right-side page shadow */}
              <div
                className="absolute top-0 right-0 bottom-0 w-4 pointer-events-none"
                style={{ background: "linear-gradient(to right, transparent, rgba(0,0,0,0.5))" }}
              />
            </div>

            {/* ── Story info ── */}
            <div className="flex-1 flex flex-col justify-between px-6 py-4">
              {/* Badge */}
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-widest"
                  style={{
                    background: `${color.accent}18`,
                    border:     `1px solid ${color.accent}40`,
                    color:       color.accent,
                  }}
                >
                  <Feather style={{ width: "9px", height: "9px" }} />
                  Najnovija priča
                </div>
              </div>

              {/* Title */}
              <h3
                className="font-bold leading-snug mb-1"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize:   "clamp(16px, 2.2vw, 22px)",
                  color:      "#e8d4b0",
                  textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                }}
              >
                {story.title}
              </h3>

              {/* Genre · Year */}
              {(story.genre || year) && (
                <p
                  className="mb-3 text-xs tracking-widest uppercase"
                  style={{ color: color.accent, opacity: 0.9 }}
                >
                  {[story.genre, year].filter(Boolean).join(" · ")}
                </p>
              )}

              {/* Excerpt */}
              {excerpt && (
                <p
                  className="leading-relaxed mb-4 line-clamp-3"
                  style={{
                    fontSize: "clamp(12px, 1.1vw, 14px)",
                    color:    "rgba(200,180,150,0.75)",
                  }}
                >
                  {excerpt}
                </p>
              )}

              {/* CTA */}
              <button
                className="self-start flex items-center gap-2 group/btn"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                <span
                  className="text-xs uppercase tracking-widest font-semibold transition-colors duration-200"
                  style={{ color: color.accent }}
                >
                  Pročitaj
                </span>
                <ArrowRight
                  className="transition-transform duration-200 group-hover/btn:translate-x-1"
                  style={{ width: "13px", height: "13px", color: color.accent }}
                />
              </button>
            </div>
          </div>

          {/* Bottom accent rule */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(200,148,90,0.25), transparent)" }}
          />

          {/* Hover glow overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(200,148,90,0.05), transparent)" }}
          />
        </div>
      </div>

      <StoryModal story={story} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
