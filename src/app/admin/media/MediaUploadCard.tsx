"use client";

import { useState, useTransition } from "react";
import { uploadSiteMedia } from "./actions";

export default function MediaUploadCard({
  label,
  fieldKey,
  mediaType,
  currentUrl,
}: {
  label: string;
  fieldKey: string;
  mediaType: "image" | "video";
  currentUrl: string | null;
}) {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set("key", fieldKey);
    formData.set("media_type", mediaType);
    startTransition(async () => {
      const res = await uploadSiteMedia(formData);
      setResult(res);
    });
  }

  return (
    <form action={handleSubmit} className="rounded-md border border-black/10 bg-navy-card p-4">
      <p className="mb-2 font-medium">{label}</p>
      {currentUrl ? (
        mediaType === "video" ? (
          <video src={currentUrl} className="mb-3 h-32 w-full rounded-sm object-cover" muted />
        ) : (
          <img src={currentUrl} alt={label} className="mb-3 h-32 w-full rounded-sm object-cover" />
        )
      ) : (
        <div className="mb-3 flex h-32 w-full items-center justify-center rounded-sm bg-navy-light text-xs text-cream/40">
          No file uploaded — using default
        </div>
      )}
      {result && (
        <p className={`mb-2 text-xs ${result.success ? "text-gold" : "text-red-600"}`}>{result.message}</p>
      )}
      <input
        type="file"
        name="file"
        accept={mediaType === "video" ? "video/mp4,video/webm" : "image/*"}
        className="mb-3 w-full text-xs text-cream/70"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-sm bg-gold px-3 py-1.5 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60"
      >
        {isPending ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
