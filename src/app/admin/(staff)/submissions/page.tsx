import { requirePermission } from "@/lib/admin-guard";

export default async function AdminSubmissions() {
  const supabase = await requirePermission("inquiries");
  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Inquiries</h1>
      <p className="mt-1 text-sm text-cream/60">
        Messages submitted through the public contact form.
      </p>

      <div className="mt-8 space-y-4">
        {(submissions ?? []).length === 0 && (
          <p className="text-sm text-cream/50">No inquiries yet.</p>
        )}
        {(submissions ?? []).map((s) => (
          <div key={s.id} className="rounded-md border border-black/10 bg-navy-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{s.full_name} {s.company ? `— ${s.company}` : ""}</p>
              <p className="text-xs text-cream/50">
                {new Date(s.created_at).toLocaleString()}
              </p>
            </div>
            <p className="mt-1 text-sm text-cream/60">
              <a href={`mailto:${s.email}`} className="text-gold hover:text-gold-light">{s.email}</a>
              {s.phone ? ` · ${s.phone}` : ""}
            </p>
            <p className="mt-3 text-sm">{s.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
