"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import RemoveClientButton from "./RemoveClientButton";

export type ClientRow = {
  id: string;
  name: string;
  company: string | null;
  status: "active" | "pending";
  lastSignIn: string | null;
  project: { id: string; name: string; pct: number } | null;
};

export default function ClientsFilter({ clients }: { clients: ClientRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q) ||
        (c.project?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [clients, query, statusFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, company, or project..."
          className="flex-1 rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
        />
        <div className="flex gap-1">
          {(["all", "active", "pending"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-wide ${
                statusFilter === s
                  ? "bg-gold text-navy"
                  : "border border-black/15 text-cream/60 hover:border-gold hover:text-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-cream/50">No client accounts match your search.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-md border border-black/10 bg-navy-card p-4"
            >
              <div className="flex items-center justify-between">
                <Link href={`/admin/clients/${c.id}`} className="group">
                  <p className="font-medium group-hover:text-gold">{c.name}</p>
                  <p className="text-sm text-cream/60">{c.company || "—"}</p>
                </Link>
                <div className="text-right">
                  <span
                    className={`rounded-sm px-2 py-1 text-xs uppercase tracking-wide ${
                      c.status === "active"
                        ? "bg-forest/10 text-forest-light"
                        : "bg-navy-light text-gold"
                    }`}
                  >
                    {c.status === "active" ? "Active" : "Not Yet Signed In"}
                  </span>
                  <p className="mt-1 text-xs text-cream/40">
                    {c.lastSignIn ? `Last signed in ${c.lastSignIn}` : "No sign-in yet"}
                  </p>
                  <div>
                    <RemoveClientButton clientId={c.id} name={c.name} />
                  </div>
                </div>
              </div>

              {c.project ? (
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="mt-3 block rounded-sm border border-black/10 bg-navy-light p-3 transition hover:border-gold/50"
                >
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-cream/70">{c.project.name}</span>
                    <span className="font-medium text-gold">{c.project.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-navy">
                    <div
                      className="h-full rounded-full bg-forest-light"
                      style={{ width: `${c.project.pct}%` }}
                    />
                  </div>
                </Link>
              ) : (
                <p className="mt-3 text-xs text-cream/40">No project assigned yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
