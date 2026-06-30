"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookOpen, ArrowLeft, CalendarDays, Tag } from "lucide-react";
import type { Story } from "@/lib/database.types";

interface StoryModalProps {
  story: Story | null;
  open: boolean;
  onClose: () => void;
}

export function StoryModal({ story, open, onClose }: StoryModalProps) {
  const [reading, setReading] = useState(false);

  useEffect(() => { setReading(false); }, [story?.id]);

  if (!story) return null;

  const formattedDate = story.written_date
    ? new Date(story.written_date).toLocaleDateString("sr-RS", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setReading(false); } }}>
      <DialogContent
        className={`p-0 gap-0 overflow-hidden border-0 ${
          reading ? "max-w-2xl max-h-[88vh] flex flex-col" : "max-w-sm"
        }`}
        style={{
          background: "linear-gradient(160deg,#1c1108 0%,#241608 55%,#1c1108 100%)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.9), 0 0 0 1px rgba(200,148,90,0.28), inset 0 0 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Top amber rule */}
        <div className="absolute top-0 inset-x-0 h-px z-20 pointer-events-none"
          style={{ background: "linear-gradient(to right,transparent,rgba(200,148,90,0.65),transparent)" }} />

        {reading ? (
          /* ── Reading view ── */
          <div className="flex flex-col min-h-0 h-full">
            {/* Reading header */}
            <div className="flex items-center gap-3 px-5 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(200,148,90,0.12)", background: "rgba(0,0,0,0.25)" }}
            >
              <button onClick={() => setReading(false)}
                className="flex items-center gap-1.5 text-stone-500 hover:text-amber-400 transition-colors text-sm shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Nazad</span>
              </button>
              <div className="w-px h-4 bg-stone-800" />
              <p className="truncate text-sm font-semibold"
                style={{ fontFamily: "Georgia,serif", color: "rgba(232,212,160,0.85)" }}
              >
                {story.title}
              </p>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-7 py-6"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(200,148,90,0.18) transparent" }}
            >
              {/* Opening ornament */}
              <div className="flex items-center justify-center gap-3 mb-7">
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,transparent,rgba(200,148,90,0.3))" }} />
                <span style={{ fontSize:"13px", color:"rgba(200,148,90,0.45)" }}>✦</span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to left,transparent,rgba(200,148,90,0.3))" }} />
              </div>

              {/* Story text */}
              <div style={{ fontFamily:"Georgia,'Times New Roman',serif", color:"#d4c5a9", fontSize:"15px", lineHeight:"1.9" }}>
                {story.content?.trim() ? (
                  <ReactMarkdown components={{
                    h1: ({children}) => <h1 style={{fontSize:"1.5em",fontWeight:"bold",marginBottom:"0.5em",marginTop:"1.2em",color:"#e8d4a0"}}>{children}</h1>,
                    h2: ({children}) => <h2 style={{fontSize:"1.25em",fontWeight:"bold",marginBottom:"0.4em",marginTop:"1em",color:"#e8d4a0"}}>{children}</h2>,
                    h3: ({children}) => <h3 style={{fontSize:"1.1em",fontWeight:"bold",marginBottom:"0.3em",color:"#e8d4a0"}}>{children}</h3>,
                    p:  ({children}) => <p style={{marginBottom:"1.1em"}}>{children}</p>,
                    strong: ({children}) => <strong style={{color:"#e8c87a",fontWeight:"bold"}}>{children}</strong>,
                    em: ({children}) => <em style={{color:"#c8b890",fontStyle:"italic"}}>{children}</em>,
                    blockquote: ({children}) => (
                      <blockquote style={{borderLeft:"3px solid rgba(200,148,90,0.4)",paddingLeft:"1.2em",marginLeft:0,marginBottom:"1em",color:"#a89870",fontStyle:"italic"}}>
                        {children}
                      </blockquote>
                    ),
                    ul: ({children}) => <ul style={{paddingLeft:"1.5em",marginBottom:"0.8em",listStyleType:"disc"}}>{children}</ul>,
                    ol: ({children}) => <ol style={{paddingLeft:"1.5em",marginBottom:"0.8em",listStyleType:"decimal"}}>{children}</ol>,
                    li: ({children}) => <li style={{marginBottom:"0.3em"}}>{children}</li>,
                    hr: () => (
                      <div style={{display:"flex",alignItems:"center",gap:"12px",margin:"1.8em 0"}}>
                        <div style={{flex:1,height:"1px",background:"linear-gradient(to right,transparent,rgba(200,148,90,0.3))"}} />
                        <span style={{fontSize:"10px",color:"rgba(200,148,90,0.4)",letterSpacing:"4px"}}>✦ ✦ ✦</span>
                        <div style={{flex:1,height:"1px",background:"linear-gradient(to left,transparent,rgba(200,148,90,0.3))"}} />
                      </div>
                    ),
                    code: ({children}) => <code style={{background:"rgba(0,0,0,0.35)",borderRadius:"3px",padding:"1px 5px",fontSize:"0.85em",fontFamily:"monospace"}}>{children}</code>,
                  }}>{story.content}</ReactMarkdown>
                ) : (
                  <p style={{color:"#5a5040",fontStyle:"italic"}}>Nema teksta…</p>
                )}
              </div>

              {/* Closing ornament */}
              <div className="flex items-center justify-center gap-3 mt-8 mb-2">
                <div className="flex-1 h-px" style={{ background:"linear-gradient(to right,transparent,rgba(200,148,90,0.22))" }} />
                <span style={{fontSize:"11px",color:"rgba(200,148,90,0.35)",letterSpacing:"5px"}}>✦ ✦ ✦</span>
                <div className="flex-1 h-px" style={{ background:"linear-gradient(to left,transparent,rgba(200,148,90,0.22))" }} />
              </div>
            </div>
          </div>
        ) : (
          /* ── Cover view ── */
          <div className="flex flex-col">

            {/* Cover image — full, not cropped */}
            {story.cover_image_url ? (
              <div className="relative w-full overflow-hidden"
                style={{ background:"#080604", maxHeight:"320px" }}
              >
                <Image
                  src={story.cover_image_url}
                  alt={story.title}
                  width={0} height={0}
                  sizes="(max-width:640px) 100vw, 400px"
                  className="w-full h-auto block"
                  style={{ maxHeight:"320px", objectFit:"contain" }}
                />
                {/* Bottom vignette blends into modal body */}
                <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                  style={{ background:"linear-gradient(to top,#1c1108,transparent)" }} />
              </div>
            ) : (
              /* No cover — ornamental placeholder */
              <div className="flex items-center justify-center py-8"
                style={{ borderBottom:"1px solid rgba(200,148,90,0.1)" }}
              >
                <span style={{fontSize:"36px",color:"rgba(200,148,90,0.25)"}}>❧</span>
              </div>
            )}

            {/* Info block */}
            <div className="px-6 pt-5 pb-6 space-y-4">

              {/* Title */}
              <h2 className="font-bold leading-snug"
                style={{
                  fontFamily:"Georgia,'Times New Roman',serif",
                  fontSize:"clamp(17px,3.5vw,22px)",
                  color:"#e8d4a0",
                  textShadow:"0 2px 14px rgba(0,0,0,0.9)",
                }}
              >
                {story.title}
              </h2>

              {/* Meta */}
              {(story.genre || formattedDate) && (
                <div className="flex flex-wrap items-center gap-3">
                  {story.genre && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3" style={{color:"rgba(200,148,90,0.65)"}} />
                      <span className="text-xs uppercase tracking-widest"
                        style={{color:"rgba(200,148,90,0.85)",fontWeight:600}}>
                        {story.genre}
                      </span>
                    </div>
                  )}
                  {story.genre && formattedDate && <div className="w-px h-3 bg-stone-700" />}
                  {formattedDate && (
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3 text-stone-600" />
                      <span className="text-xs text-stone-500">{formattedDate}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="h-px"
                style={{background:"linear-gradient(to right,rgba(200,148,90,0.22),transparent)"}} />

              {/* Read CTA */}
              {story.content && (
                <button
                  onClick={() => setReading(true)}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-sm transition-all duration-200"
                  style={{
                    background:"linear-gradient(to right,rgba(200,148,90,0.13),rgba(200,148,90,0.07))",
                    border:"1px solid rgba(200,148,90,0.28)",
                    color:"rgba(200,148,90,0.88)",
                    fontFamily:"Georgia,serif",
                    fontSize:"13px",
                    letterSpacing:"0.12em",
                    cursor:"pointer",
                  }}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, {
                    background:"linear-gradient(to right,rgba(200,148,90,0.24),rgba(200,148,90,0.14))",
                    borderColor:"rgba(200,148,90,0.5)",
                    color:"rgba(224,184,100,1)",
                  })}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, {
                    background:"linear-gradient(to right,rgba(200,148,90,0.13),rgba(200,148,90,0.07))",
                    borderColor:"rgba(200,148,90,0.28)",
                    color:"rgba(200,148,90,0.88)",
                  })}
                >
                  <BookOpen className="h-4 w-4" />
                  Pročitaj priču
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom amber rule */}
        <div className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
          style={{background:"linear-gradient(to right,transparent,rgba(200,148,90,0.3),transparent)"}} />
      </DialogContent>
    </Dialog>
  );
}
