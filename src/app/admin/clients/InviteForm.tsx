"use client";

import { useState, useTransition } from "react";
import { inviteClient } from "./actions";

export default function InviteForm() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await inviteClient(formData);
      setResult(res);
    });
  }

  return (
    <form action={handleSubmit} className="grid gap-3 rounded-md border border-black/10 bg-navy-card p-4 sm:grid-cols-2">
      {result && (
        <p className={`sm:col-span-2 rounded-sm px-3 py-2 text-sm ${result.success ? "border border-gold/40 text-gold" : "border border-red-400/40 bg-red-50 text-red-600"}`}>
          {result.message}
        </p>
      )}
      <input name="full_name" required placeholder="Client full name" className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
      <input name="email" required type="email" placeholder="Client email" className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
      <input name="company" placeholder="Company (optional)" className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none sm:col-span-2" />
      <button type="submit" disabled={isPending} className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60 sm:col-span-2">
        {isPending ? "Sending invite..." : "Send Client Invite"}
      </button>
    </form>
  );
}
