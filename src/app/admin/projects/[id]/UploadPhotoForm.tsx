"use client";

import { useState, useTransition } from "react";
import { uploadProjectImage } from "./actions";

export default function UploadPhotoForm({ projectId }: { projectId: string }) {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set("project_id", projectId);
    startTransition(async () => {
      const res = await uploadProjectImage(formData);
      setResult(res);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-wrap items-center gap-3 rounded-md border border-black/10 bg-navy-card p-4">
      <input type="file" name="file" accept="image/*" className="text-sm text-cream/70" />
      <button type="submit" disabled={isPending} className="rounded-sm bg-gold px-3 py-1.5 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60">
        {isPending ? "Uploading..." : "Add Photo"}
      </button>
      {result && <p className={`text-xs ${result.success ? "text-gold" : "text-red-600"}`}>{result.message}</p>}
    </form>
  );
}
