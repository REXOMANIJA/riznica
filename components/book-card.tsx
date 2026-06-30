"use client";

import React from "react";
import type { Story } from "@/lib/database.types";

/* ── Aged leather colour palette ── */
const leatherColors: { bg: string; bgMid: string; text: string; accent: string }[] = [
  { bg: "#5c1a1a", bgMid: "#4a1414", text: "#e8c89a", accent: "#c8945a" }, // oxblood
  { bg: "#1a3d2e", bgMid: "#163325", text: "#a8d4b8", accent: "#70b890" }, // forest green
  { bg: "#1a2a4a", bgMid: "#15223d", text: "#9ab4d8", accent: "#6890c0" }, // midnight navy
  { bg: "#3d2210", bgMid: "#32180a", text: "#e0b880", accent: "#c09050" }, // chocolate
  { bg: "#2d1a40", bgMid: "#241535", text: "#c4a8e0", accent: "#9870c8" }, // plum
  { bg: "#3a1a0a", bgMid: "#2e1408", text: "#e8c080", accent: "#c89840" }, // dark amber
  { bg: "#1a3a3a", bgMid: "#143030", text: "#90d0c8", accent: "#60b0a8" }, // teal
  { bg: "#3a1a2a", bgMid: "#2e1422", text: "#e0a0c0", accent: "#c07090" }, // burgundy rose
  { bg: "#2a3010", bgMid: "#22270c", text: "#c8d090", accent: "#a0b060" }, // olive
  { bg: "#1a1a3a", bgMid: "#141430", text: "#a0a8e8", accent: "#7080d0" }, // slate blue
  { bg: "#401808", bgMid: "#341206", text: "#e8a870", accent: "#c07840" }, // burnt sienna
  { bg: "#183030", bgMid: "#122626", text: "#80c8c0", accent: "#50a098" }, // sea green
];


/* ── Title sizing based on length ── */
function titleFontSize(t: string): string {
  const n = t.length;
  if (n <=  8) return "clamp(14px, 1.7vw, 17px)";
  if (n <= 15) return "clamp(12px, 1.5vw, 14px)";
  if (n <= 25) return "clamp(10px, 1.25vw, 12px)";
  return "clamp(9px, 1.1vw, 11px)";
}
function titleClamp(t: string): number {
  const n = t.length;
  if (n <= 10) return 2;
  if (n <= 25) return 3;
  return 5;
}

/* ── Empty-book ornament designs (8 cycling) ── */
const ORNAMENTS: Array<(a: string) => React.ReactNode> = [
  /* 0 – star with triple dots */
  (a: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
      <div style={{ fontSize:"7px", color:`${a}66`, letterSpacing:"4px" }}>· · ·</div>
      <div style={{ fontSize:"16px", color:`${a}80`, lineHeight:1 }}>✦</div>
      <div style={{ fontSize:"7px", color:`${a}66`, letterSpacing:"4px" }}>· · ·</div>
    </div>
  ),
  /* 1 – three diamonds stacked */
  (a: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
      <div style={{ fontSize:"9px",  color:`${a}55`, lineHeight:1 }}>◆</div>
      <div style={{ fontSize:"14px", color:`${a}78`, lineHeight:1 }}>◆</div>
      <div style={{ fontSize:"9px",  color:`${a}55`, lineHeight:1 }}>◆</div>
    </div>
  ),
  /* 2 – fleur with rules */
  (a: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
      <div style={{ width:"36px", height:"1px", background:`linear-gradient(to right,transparent,${a}60,transparent)` }} />
      <div style={{ fontSize:"18px", color:`${a}78`, lineHeight:1 }}>❧</div>
      <div style={{ width:"36px", height:"1px", background:`linear-gradient(to right,transparent,${a}60,transparent)` }} />
    </div>
  ),
  /* 3 – heraldic with double rule */
  (a: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
      <div style={{ display:"flex", gap:"3px" }}>
        <div style={{ width:"16px", height:"1px", background:`${a}50`, marginTop:"6px" }} />
        <div style={{ fontSize:"16px", color:`${a}80`, lineHeight:1 }}>⚜</div>
        <div style={{ width:"16px", height:"1px", background:`${a}50`, marginTop:"6px" }} />
      </div>
      <div style={{ width:"40px", height:"1px", background:`linear-gradient(to right,transparent,${a}45,transparent)` }} />
    </div>
  ),
  /* 4 – asterism with tiny stars */
  (a: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
      <div style={{ fontSize:"8px", color:`${a}55`, letterSpacing:"5px", marginLeft:"4px" }}>✦ ✦</div>
      <div style={{ fontSize:"16px", color:`${a}78`, lineHeight:1 }}>⁂</div>
      <div style={{ fontSize:"8px", color:`${a}55`, letterSpacing:"5px", marginLeft:"4px" }}>✦ ✦</div>
    </div>
  ),
  /* 5 – floral with corner dots */
  (a: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
      <div style={{ fontSize:"8px", color:`${a}50`, letterSpacing:"6px" }}>· ·</div>
      <div style={{ fontSize:"17px", color:`${a}80`, lineHeight:1 }}>✿</div>
      <div style={{ fontSize:"8px", color:`${a}50`, letterSpacing:"6px" }}>· ·</div>
    </div>
  ),
  /* 6 – ornate cross flanked by small stars */
  (a: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
      <div style={{ fontSize:"9px", color:`${a}60`, lineHeight:1 }}>✦</div>
      <div style={{ fontSize:"15px", color:`${a}80`, lineHeight:1 }}>❋</div>
      <div style={{ fontSize:"9px", color:`${a}60`, lineHeight:1 }}>✦</div>
    </div>
  ),
  /* 7 – double rule + double star */
  (a: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
      <div style={{ width:"38px", height:"1px", background:`linear-gradient(to right,transparent,${a}55,transparent)` }} />
      <div style={{ fontSize:"13px", color:`${a}80`, lineHeight:1, letterSpacing:"4px" }}>✦✦</div>
      <div style={{ width:"38px", height:"1px", background:`linear-gradient(to right,transparent,${a}55,transparent)` }} />
    </div>
  ),
];

interface BookCardProps {
  story: Story;
  index: number;
  onClick: () => void;
}

export function BookCard({ story, index, onClick }: BookCardProps) {
  const color = leatherColors[typeof story.cover_color === 'number' ? story.cover_color : 0];
  const year  = story.written_date ? new Date(story.written_date).getFullYear() : null;

  return (
    <div
      className="w-full h-full cursor-pointer group select-none relative"
      onClick={onClick}
    >
      {/* ── Hover tooltip (above book) ── */}
      <div
        className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 ease-out w-max max-w-[150px]"
      >
        <div
          className="rounded-md px-3 py-2 text-center"
          style={{
            background: "linear-gradient(135deg, #1c1108f2, #2c1c0ef2)",
            border:     `1px solid ${color.accent}60`,
            boxShadow:  `0 6px 24px rgba(0,0,0,0.85), 0 0 10px ${color.accent}30`,
          }}
        >
          <p className="font-bold leading-snug" style={{ fontSize: "11px", color: color.text }}>
            {story.title}
          </p>
          {(story.genre || year) && (
            <p className="mt-1" style={{ fontSize: "9px", color: color.accent, letterSpacing: "0.05em" }}>
              {[story.genre, year].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full"
          style={{
            width: 0, height: 0,
            borderLeft:  "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop:   `5px solid ${color.accent}60`,
          }}
        />
      </div>

      {/* ── Front cover ── */}
      <div
        className="w-full h-full rounded-[3px] relative overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.06]"
        style={{
          background: `linear-gradient(
            150deg,
            ${color.bg}ff  0%,
            ${color.bgMid}ff 40%,
            ${color.bg}ee  70%,
            ${color.bgMid}dd 100%
          )`,
          boxShadow: `
            3px 5px 14px rgba(0,0,0,0.75),
            -1px 0 5px rgba(0,0,0,0.3),
            inset 0 0 0 1px rgba(255,255,255,0.03)
          `,
        }}
      >
        {/* Leather grain texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.04) 3px,
                rgba(0,0,0,0.04) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 4px,
                rgba(255,255,255,0.015) 4px,
                rgba(255,255,255,0.015) 5px
              )
            `,
          }}
        />

        {/* Leather sheen highlight */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 38% at 28% 18%, rgba(255,255,255,0.07), transparent)" }}
        />

        {/* Left binding shadow + stitch lines */}
        <div className="absolute top-0 bottom-0 left-0 w-[6px]"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.18), transparent)" }} />
        <div className="absolute top-0 bottom-0 left-[3px] w-px"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 5px, rgba(255,255,255,0.06) 5px, rgba(255,255,255,0.06) 6px)" }} />

        {/* Top gilt edge (pages) */}
        <div className="absolute top-0 left-0 right-0 h-[4px]"
          style={{ background: "linear-gradient(to bottom, rgba(255,215,80,0.85), rgba(190,150,40,0.55), rgba(100,70,10,0.2))" }} />

        {/* Right page edges */}
        <div className="absolute top-[4px] bottom-0 right-0 w-[4px]"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(to bottom, rgba(232,212,172,0.55) 0px, rgba(232,212,172,0.55) 0.8px, rgba(170,150,110,0.06) 0.8px, rgba(170,150,110,0.06) 2.5px)",
              "linear-gradient(to left, rgba(215,195,155,0.35), transparent)",
            ].join(", "),
          }}
        />

        {/* Outer decorative border frame */}
        <div
          className="absolute rounded-[2px]"
          style={{
            top: "8%", left: "8%", right: "8%", bottom: "8%",
            border: `1px solid ${color.accent}65`,
            boxShadow: `inset 0 0 8px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.3)`,
          }}
        />

        {/* Inner corner accents */}
        {[
          { top: "8%",  left: "8%"  },
          { top: "8%",  right: "8%" },
          { bottom: "8%", left: "8%"  },
          { bottom: "8%", right: "8%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-[6px] h-[6px]"
            style={{
              ...pos,
              background: `radial-gradient(circle, ${color.accent}80, transparent 70%)`,
            }}
          />
        ))}

        {/* Top accent bar (inside frame) */}
        <div
          className="absolute"
          style={{
            top: "14%", left: "10%", right: "10%", height: "1px",
            background: `linear-gradient(to right, transparent, ${color.accent}55, transparent)`,
          }}
        />

        {/* Title area */}
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{ top: "17%", left: "10%", right: "10%", bottom: "22%" }}
        >
          <p
            className="font-semibold leading-snug"
            style={{
              fontFamily:      "Georgia, 'Times New Roman', serif",
              fontSize:        titleFontSize(story.title),
              color:           color.text,
              textShadow:      `0 1px 3px rgba(0,0,0,0.7)`,
              display:         "-webkit-box",
              WebkitLineClamp: titleClamp(story.title),
              WebkitBoxOrient: "vertical" as const,
              overflow:        "hidden",
              letterSpacing:   "0.05em",
            }}
          >
            {story.title}
          </p>
        </div>

        {/* Bottom accent bar (inside frame) */}
        <div
          className="absolute"
          style={{
            bottom: "14%", left: "10%", right: "10%", height: "1px",
            background: `linear-gradient(to right, transparent, ${color.accent}40, transparent)`,
          }}
        />

        {/* Genre / year */}
        {(story.genre || year) && (
          <div
            className="absolute text-center overflow-hidden"
            style={{ bottom: "9%", left: "10%", right: "10%", height: "12px" }}
          >
            <p
              style={{
                fontSize:      "clamp(7px, 0.85vw, 9px)",
                color:         color.accent,
                textShadow:    "0 1px 4px rgba(0,0,0,0.8)",
                letterSpacing: "0.07em",
                overflow:      "hidden",
                textOverflow:  "ellipsis",
                whiteSpace:    "nowrap",
              }}
            >
              {[story.genre, year].filter(Boolean).join(" · ")}
            </p>
          </div>
        )}

        {/* Hover light sheen */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(145deg, ${color.accent}18 0%, transparent 55%)`,
          }}
        />

        {/* Hover warm glow shadow (applied via filter + boxShadow trick) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${color.accent}20`,
          }}
        />
      </div>
    </div>
  );
}

interface EmptyBookProps {
  index: number;
}

export function EmptyBook({ index }: EmptyBookProps) {
  // Offset by half the palette so empties visually differ from their filled neighbours
  const color = leatherColors[(index + 6) % leatherColors.length];

  return (
    <div className="w-full h-full relative" style={{ opacity: 0.72 }}>
      <div
        className="w-full h-full rounded-[3px] relative overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${color.bg}ff 0%, ${color.bgMid}ff 40%, ${color.bg}ee 70%, ${color.bgMid}dd 100%)`,
          boxShadow: "3px 5px 14px rgba(0,0,0,0.7), -1px 0 5px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        {/* Leather grain */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
              "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.012) 4px, rgba(255,255,255,0.012) 5px)",
            ].join(", "),
          }}
        />

        {/* Leather sheen */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 38% at 28% 18%, rgba(255,255,255,0.05), transparent)" }}
        />

        {/* Left binding shadow */}
        <div className="absolute top-0 bottom-0 left-0 w-[6px]"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.15), transparent)" }} />
        <div className="absolute top-0 bottom-0 left-[3px] w-px"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px)" }} />

        {/* Top gilt edge */}
        <div className="absolute top-0 left-0 right-0 h-[4px]"
          style={{ background: "linear-gradient(to bottom, rgba(255,215,80,0.75), rgba(190,150,40,0.45), rgba(100,70,10,0.15))" }} />

        {/* Right page edges */}
        <div className="absolute top-[4px] bottom-0 right-0 w-[4px]"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(to bottom, rgba(232,212,172,0.5) 0px, rgba(232,212,172,0.5) 0.8px, rgba(170,150,110,0.05) 0.8px, rgba(170,150,110,0.05) 2.5px)",
              "linear-gradient(to left, rgba(215,195,155,0.3), transparent)",
            ].join(", "),
          }}
        />

        {/* Decorative border frame (same as filled) */}
        <div className="absolute rounded-[2px]"
          style={{
            top: "8%", left: "8%", right: "8%", bottom: "8%",
            border: `1px solid ${color.accent}50`,
            boxShadow: `inset 0 0 6px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.25)`,
          }}
        />

        {/* Corner accents */}
        {[
          { top: "8%",    left: "8%"   },
          { top: "8%",    right: "8%"  },
          { bottom: "8%", left: "8%"   },
          { bottom: "8%", right: "8%"  },
        ].map((pos, i) => (
          <div key={i} className="absolute w-[5px] h-[5px]"
            style={{ ...pos, background: `radial-gradient(circle, ${color.accent}60, transparent 70%)` }}
          />
        ))}

        {/* Top accent line */}
        <div className="absolute"
          style={{ top: "14%", left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${color.accent}40, transparent)` }}
        />

        {/* Centred ornament — cycles through 8 designs */}
        <div className="absolute inset-0 flex items-center justify-center">
          {ORNAMENTS[index % ORNAMENTS.length](color.accent)}
        </div>

        {/* Bottom accent line */}
        <div className="absolute"
          style={{ bottom: "14%", left: "10%", right: "10%", height: "1px", background: `linear-gradient(to right, transparent, ${color.accent}30, transparent)` }}
        />
      </div>
    </div>
  );
}
