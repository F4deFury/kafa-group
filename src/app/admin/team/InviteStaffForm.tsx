"use client";

import { useState, useTransition } from "react";
import { inviteStaff } from "./actions";

export default function InviteStaffForm() {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await inviteStaff(formData);
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
      <input name="full_name" required placeholder="Full name" className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
      <input name="email" required type="email" placeholder="Email" className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none" />
      <select name="role" defaultValue="staff" className="rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream sm:col-span-2">
        <option value="staff">Staff</option>
        <option value="management">Management</option>
      </select>
      <div className="flex flex-wrap gap-4 text-sm text-cream/70 sm:col-span-2">
        <label className="flex items-center gap-1"><input type="checkbox" name="perm_content" /> Content</label>
        <label className="flex items-center gap-1"><input type="checkbox" name="perm_projects" /> Projects</label>
        <label className="flex items-center gap-1"><input type="checkbox" name="perm_inquiries" /> Inquiries</label>
        <label className="flex items-center gap-1"><input type="checkbox" name="perm_clients" /> Clients</label>
      </div>
      <button type="submit" disabled={isPending} className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60 sm:col-span-2">
        {isPending ? "Sending invite..." : "Send Staff Invite"}
      </button>
    </form>
  );
}
