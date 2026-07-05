"use client";

import { useState, useTransition } from "react";
import { updateOwnProfile } from "./actions";

type Profile = { full_name: string | null; company: string | null; phone: string | null };

export default function SettingsForm({ profile, email }: { profile: Profile; email: string }) {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await updateOwnProfile(formData);
      setResult(res);
    });
  }

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4 rounded-md border border-black/10 bg-navy-card p-6">
      {result && (
        <p className={`rounded-sm px-3 py-2 text-sm ${result.success ? "border border-gold/40 text-gold" : "border border-red-400/40 bg-red-50 text-red-600"}`}>
          {result.message}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm text-cream/60">Email</label>
        <input disabled value={email} className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream/50" />
        <p className="mt-1 text-xs text-cream/40">Email cannot be changed here — contact an administrator.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm text-cream/60">Full Name</label>
        <input name="full_name" defaultValue={profile.full_name ?? ""} className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-cream/60">Company</label>
        <input name="company" defaultValue={profile.company ?? ""} className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-cream/60">Phone</label>
        <input name="phone" defaultValue={profile.phone ?? ""} className="w-full rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
      </div>
      <button type="submit" disabled={isPending} className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60">
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
