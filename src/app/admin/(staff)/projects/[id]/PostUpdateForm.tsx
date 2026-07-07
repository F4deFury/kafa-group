"use client";

import { useState, useTransition } from "react";
import { postProjectUpdate } from "./actions";

export default function PostUpdateForm({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();
  const [posted, setPosted] = useState(false);

  function handleSubmit(formData: FormData) {
    formData.set("project_id", projectId);
    setPosted(false);
    startTransition(async () => {
      await postProjectUpdate(formData);
      setPosted(true);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-md border border-black/10 bg-navy-card p-4"
    >
      <label className="mb-1 block text-sm text-cream/70">Update note</label>
      <textarea
        name="note"
        rows={2}
        required
        placeholder="e.g. Framing inspection passed on the east wing."
        className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-cream/70">
          <input type="checkbox" name="notify_client" defaultChecked />
          Notify client (adds a notification + dashboard alert)
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60"
        >
          {isPending ? "Posting..." : "Post Update"}
        </button>
      </div>
      {posted && !isPending && (
        <p className="mt-2 text-xs text-forest-light">Update posted.</p>
      )}
    </form>
  );
}
