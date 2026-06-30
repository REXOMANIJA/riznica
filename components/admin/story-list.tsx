"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Pencil,
  Trash2,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { Story } from "@/lib/database.types";

interface StoryListProps {
  stories: Story[];
  onEdit: (story: Story) => void;
  onRefresh: () => void;
}

function SortableRow({
  story,
  onEdit,
  onDelete,
  onTogglePublish,
  deleting,
  toggling,
}: {
  story: Story;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  deleting: boolean;
  toggling: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: story.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-stone-800/60 border border-stone-700 rounded-lg px-3 py-2.5 group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-stone-600 hover:text-stone-400 cursor-grab active:cursor-grabbing touch-none"
        aria-label="Prerasporedi"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-stone-100 text-sm font-medium truncate">
          {story.title}
        </p>
        <p className="text-stone-500 text-xs">
          {story.genre || "—"}
          {!story.is_published && (
            <span className="ml-1 text-amber-600">(skriveno)</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title={story.is_published ? "Sakrij" : "Objavi"}
          onClick={onTogglePublish}
          disabled={toggling}
        >
          {toggling ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : story.is_published ? (
            <ToggleRight className="h-4 w-4 text-amber-400" />
          ) : (
            <ToggleLeft className="h-4 w-4 text-stone-500" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-red-400"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

export function StoryList({ stories: initialStories, onEdit, onRefresh }: StoryListProps) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    setStories(initialStories);
  }, [initialStories]);

  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stories.findIndex((s) => s.id === active.id);
    const newIndex = stories.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(stories, oldIndex, newIndex);
    setStories(reordered);

    const supabase = createClient();
    await Promise.all(
      reordered.map((s, i) =>
        supabase.from("stories").update({ shelf_order: i }).eq("id", s.id)
      )
    );
    onRefresh();
  }

  async function handleTogglePublish(story: Story) {
    setTogglingId(story.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("stories")
      .update({ is_published: !story.is_published })
      .eq("id", story.id);
    if (error) {
      console.error("Failed to toggle publish status:", error.message);
      setTogglingId(null);
      return;
    }
    setStories((prev) =>
      prev.map((s) => s.id === story.id ? { ...s, is_published: !s.is_published } : s)
    );
    setTogglingId(null);
    onRefresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("stories").delete().eq("id", id);
    setStories((prev) => prev.filter((s) => s.id !== id));
    setConfirmDelete(null);
    setDeletingId(null);
    onRefresh();
  }

  if (stories.length === 0) {
    return (
      <p className="text-stone-600 text-sm text-center py-6">
        Nema priča. Dodaj prvu!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={stories.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {stories.map((story) => (
            <div key={story.id}>
              <SortableRow
                story={story}
                onEdit={() => onEdit(story)}
                deleting={deletingId === story.id}
                toggling={togglingId === story.id}
                onDelete={() => setConfirmDelete(story.id)}
                onTogglePublish={() => handleTogglePublish(story)}
              />
              {confirmDelete === story.id && (
                <div className="mt-1 mb-2 flex items-center gap-2 px-3 py-2 bg-red-950/30 border border-red-900/50 rounded-lg text-sm text-red-300">
                  <span className="flex-1">Obriši &ldquo;{story.title}&rdquo;?</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleDelete(story.id)}
                    disabled={!!deletingId}
                  >
                    Obriši
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setConfirmDelete(null)}
                  >
                    Odustani
                  </Button>
                </div>
              )}
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
