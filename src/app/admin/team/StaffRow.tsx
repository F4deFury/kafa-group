"use client";

import { useState, useTransition } from "react";
import { updateStaffAccess } from "./actions";

type Permissions = { content: boolean; projects: boolean; inquiries: boolean; clients: boolean };

export default function StaffRow({
  profile,
}: {
  profile: { id: string; full_name: string | null; role: string; permissions: Permissions };
}) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(formData: FormData) {
    formData.set("id", profile.id);
    startTransition(async () => {
      await updateStaffAccess(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <form action={handleSubmit} className="rounded-md border border-black/10 bg-navy-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{profile.full_name || "(pending invite)"}</p>
        </div>
        <select
          name="role"
          defaultValue={profile.role}
          className="rounded-sm border border-black/15 bg-navy-light px-2 py-1 text-sm text-cream"
        >
          <option value="client">Client</option>
          <option value="staff">Staff</option>
          <option value="management">Management</option>
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-cream/70">
        <label className="flex items-center gap-1">
          <input type="checkbox" name="perm_content" defaultChecked={profile.permissions?.content} /> Content
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" name="perm_projects" defaultChecked={profile.permissions?.projects} /> Projects
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" name="perm_inquiries" defaultChecked={profile.permissions?.inquiries} /> Inquiries
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" name="perm_clients" defaultChecked={profile.permissions?.clients} /> Clients
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-3 rounded-sm bg-gold px-3 py-1.5 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60"
      >
        {isPending ? "Saving..." : saved ? "Saved" : "Save"}
      </button>
      <p className="mt-2 text-xs text-cream/40">
        Permissions are ignored for the Management role, which always has full access.
      </p>
    </form>
  );
}
