type Update = {
  id: string;
  note: string;
  created_at: string;
};

export default function ActivityFeed({ updates }: { updates: Update[] }) {
  if (updates.length === 0) {
    return <p className="text-sm text-cream/50">No activity has been posted yet.</p>;
  }

  return (
    <div className="space-y-3">
      {updates.map((u, i) => (
        <div key={u.id} className="flex gap-3">
          <div
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
              i === 0 ? "bg-forest-light" : "bg-cream/30"
            }`}
          />
          <div>
            <p className="text-sm text-cream/90">{u.note}</p>
            <p className="mt-0.5 text-xs text-cream/40">
              {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
