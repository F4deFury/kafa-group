"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { getDocumentDownloadUrl } from "../actions";

type Doc = { id: string; name: string; created_at: string };

export default function DocumentList({ documents }: { documents: Doc[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload(id: string) {
    setError(null);
    setLoadingId(id);
    const res = await getDocumentDownloadUrl(id);
    setLoadingId(null);
    if (!res.success) {
      setError(res.message);
      return;
    }
    window.open(res.url, "_blank", "noopener,noreferrer");
  }

  if (documents.length === 0) {
    return (
      <p className="text-sm text-cream/50">
        No documents have been shared yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-red-500">{error}</p>}
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => handleDownload(doc.id)}
          disabled={loadingId === doc.id}
          className="flex w-full items-center justify-between rounded-md border border-black/10 bg-navy-card p-3 text-left transition hover:border-gold/50 disabled:opacity-60"
        >
          <span className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-forest-light" />
            {doc.name}
          </span>
          <Download className="h-4 w-4 text-cream/40" />
        </button>
      ))}
    </div>
  );
}
