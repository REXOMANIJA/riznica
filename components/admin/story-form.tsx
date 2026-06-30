"use client";

import { useState, FormEvent, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X } from "lucide-react";
import type { Story, SizePreset, CoverColor } from "@/lib/database.types";
import Image from "next/image";

const SLOTS_PER_ROW = 6;

interface StoryFormProps {
  story?: Story;
  onSuccess: () => void;
  onCancel: () => void;
  occupiedSlots: number[];
  rows: number;
}

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

interface StoryFormProps {
  story?: Story;
  onSuccess: () => void;
  onCancel: () => void;
  occupiedSlots: number[];
}

export function StoryForm({
  story,
  onSuccess,
  onCancel,
  occupiedSlots,
  rows,
}: StoryFormProps) {
  const isEdit = !!story;
  const TOTAL_SLOTS = SLOTS_PER_ROW * rows;
  const [title, setTitle] = useState(story?.title ?? "");
  const [genre, setGenre] = useState(story?.genre ?? "");
  const [writtenDate, setWrittenDate] = useState(story?.written_date ?? "");
  const [content, setContent] = useState(story?.content ?? "");
  const [isPublished, setIsPublished] = useState(story?.is_published ?? true);
  const [coverColor, setCoverColor] = useState<CoverColor>(
    typeof story?.cover_color === 'number' ? story.cover_color : 0
  );
  const firstFreeSlot = Array.from({ length: TOTAL_SLOTS }, (_, i) => i).find(
    (i) => !occupiedSlots.includes(i) || i === story?.shelf_order
  ) ?? 0;
  const [shelfSlot, setShelfSlot] = useState<number>(story?.shelf_order ?? firstFreeSlot);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    story?.cover_image_url ?? null
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contentTab, setContentTab] = useState<"write" | "preview">("write");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function uploadCover(userId: string): Promise<string | null> {
    if (!coverFile) return story?.cover_image_url ?? null;
    const supabase = createClient();
    const ext = coverFile.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("covers")
      .upload(path, coverFile, { upsert: true });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from("covers").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Naslov je obavezan.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      console.log("Auth user:", user, userError);
      if (!user) throw new Error("Nisi prijavljen. (" + (userError?.message ?? "no session") + ")");

      let coverUrl: string | null = null;
      try {
        coverUrl = await uploadCover(user.id);
      } catch (uploadErr: unknown) {
        console.error("Cover upload failed:", uploadErr);
        throw new Error("Upload slike nije uspio: " + (uploadErr instanceof Error ? uploadErr.message : String(uploadErr)));
      }

      const payload = {
        title: title.trim(),
        genre: genre.trim() || null,
        content: content.trim() || null,
        cover_image_url: coverUrl,
        written_date: writtenDate || null,
        is_published: isPublished,
        cover_color: coverColor,
        shelf_order: shelfSlot,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (isEdit && story) {
        const { error: updateError } = await supabase
          .from("stories")
          .update(payload)
          .eq("id", story.id);
        if (updateError) throw new Error(updateError.message);
      } else {
        const { error: insertError } = await supabase.from("stories").insert({
          ...payload,
          created_at: new Date().toISOString(),
        });
        if (insertError) throw new Error(insertError.message);
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Greška pri spremanju.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Naslov *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Naziv priče"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="genre">Žanr</Label>
          <Input
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Bajka, drama..."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="date">Datum pisanja</Label>
          <Input
            id="date"
            type="date"
            value={writtenDate}
            onChange={(e) => setWrittenDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Mjesto na polici</Label>
        <div className="space-y-1">
          {Array.from({ length: rows }, (_, rowIdx) => (
            <div key={rowIdx} className="flex gap-0.5 items-center">
              <span className="text-stone-600 text-[10px] w-12 shrink-0">
                Red {rowIdx + 1}
              </span>
              <div className="flex gap-0.5 flex-wrap">
                {Array.from({ length: SLOTS_PER_ROW }, (_, colIdx) => {
                  const slot = rowIdx * SLOTS_PER_ROW + colIdx;
                  const isOccupied = occupiedSlots.includes(slot) && slot !== story?.shelf_order;
                  const isSelected = shelfSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => setShelfSlot(slot)}
                      title={`Slot ${slot + 1}`}
                      className={`w-5 h-5 rounded-sm text-[9px] border transition-colors ${
                        isSelected
                          ? "bg-amber-600 border-amber-500 text-stone-950"
                          : isOccupied
                          ? "bg-stone-800 border-stone-700 text-stone-700 cursor-not-allowed"
                          : "bg-stone-800 border-stone-600 text-stone-500 hover:border-amber-600 hover:text-amber-400"
                      }`}
                    >
                      {colIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-stone-600 text-[10px] mt-1">
            Odabrano: Red {Math.floor(shelfSlot / SLOTS_PER_ROW) + 1}, Mjesto {(shelfSlot % SLOTS_PER_ROW) + 1}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Boja korica</Label>
        <div className="flex gap-2 flex-wrap">
          {leatherColors.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCoverColor(index as CoverColor)}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                coverColor === index
                  ? "border-amber-400 ring-2 ring-amber-400/50"
                  : "border-stone-600 hover:border-stone-500"
              }`}
              style={{ background: color.bg }}
              title={`Boja ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Naslovnica</Label>
        <div className="flex items-start gap-3">
          {coverPreview && (
            <div className="relative w-16 h-20 rounded overflow-hidden shrink-0">
              <Image
                src={coverPreview}
                alt="Naslovnica"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverPreview(null);
                  setCoverFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5"
              >
                <X className="h-2.5 w-2.5 text-white" />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-stone-600 text-stone-400 hover:border-amber-600 hover:text-amber-400 cursor-pointer text-sm transition-colors">
            <Upload className="h-4 w-4" />
            {coverPreview ? "Promijeni sliku" : "Učitaj sliku"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Tekst priče</Label>
          <div className="flex rounded-md overflow-hidden border border-stone-700 text-xs">
            <button
              type="button"
              onClick={() => setContentTab("write")}
              className={`px-3 py-1 transition-colors ${
                contentTab === "write"
                  ? "bg-amber-700 text-stone-950 font-medium"
                  : "bg-stone-800 text-stone-400 hover:text-stone-200"
              }`}
            >
              Piši
            </button>
            <button
              type="button"
              onClick={() => setContentTab("preview")}
              className={`px-3 py-1 transition-colors ${
                contentTab === "preview"
                  ? "bg-amber-700 text-stone-950 font-medium"
                  : "bg-stone-800 text-stone-400 hover:text-stone-200"
              }`}
            >
              Pregled
            </button>
          </div>
        </div>

        {contentTab === "write" ? (
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Jednom davno..."
            className="min-h-[200px] resize-y font-mono text-sm"
          />
        ) : (
          <div
            className="min-h-[200px] rounded-md border border-stone-700 bg-stone-900 px-3 py-2.5 overflow-auto"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#d4c5a9",
              fontSize: "14px",
              lineHeight: "1.7",
            }}
          >
            {content.trim() ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 style={{ fontSize: "1.4em", fontWeight: "bold", marginBottom: "0.5em", color: "#e8d4a0" }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: "0.4em", color: "#e8d4a0" }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: "1.05em", fontWeight: "bold", marginBottom: "0.3em", color: "#e8d4a0" }}>{children}</h3>,
                  p:  ({ children }) => <p style={{ marginBottom: "0.9em" }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ color: "#e8c87a", fontWeight: "bold" }}>{children}</strong>,
                  em: ({ children }) => <em style={{ color: "#c8b890", fontStyle: "italic" }}>{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote style={{ borderLeft: "3px solid rgba(200,148,90,0.5)", paddingLeft: "1em", marginLeft: 0, color: "#b0a080", fontStyle: "italic" }}>
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => <ul style={{ paddingLeft: "1.4em", marginBottom: "0.8em", listStyleType: "disc" }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ paddingLeft: "1.4em", marginBottom: "0.8em", listStyleType: "decimal" }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: "0.2em" }}>{children}</li>,
                  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(200,148,90,0.25)", margin: "1em 0" }} />,
                  code: ({ children }) => <code style={{ background: "rgba(0,0,0,0.3)", borderRadius: "3px", padding: "1px 4px", fontSize: "0.85em", fontFamily: "monospace" }}>{children}</code>,
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p style={{ color: "#5a5040", fontStyle: "italic" }}>Nema teksta za prikaz…</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label htmlFor="published" className="cursor-pointer">
          Objavljeno
        </Label>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isEdit ? (
            "Spremi promjene"
          ) : (
            "Dodaj priču"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Odustani
        </Button>
      </div>
    </form>
  );
}
