"use client";

import { useState, useTransition } from "react";
import { addHeroSlide } from "./hero-actions";

export default function AddHeroSlideForm() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await addHeroSlide(formData);
      setResult(res);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-md border border-black/10 bg-navy-card p-4">
      <div>
        <label className="mb-1 block text-xs text-cream/60">Image or video file</label>
        <input type="file" name="file" accept="image/*,video/mp4,video/webm" className="text-sm text-cream/70" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-cream/60">Duration (seconds, images only)</label>
        <input type="number" name="duration_seconds" defaultValue={8} min={3} className="w-24 rounded-sm border border-black/15 bg-navy-light px-2 py-1 text-sm text-cream" />
      </div>
      <button type="submit" disabled={isPending} className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60">
        {isPending ? "Adding..." : "Add to Rotation"}
      </button>
      {result && <p className={`w-full text-xs ${result.success ? "text-gold" : "text-red-600"}`}>{result.message}</p>}
    </form>
  );
}
