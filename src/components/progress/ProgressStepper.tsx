type Milestone = {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "completed";
};

export default function ProgressStepper({ milestones }: { milestones: Milestone[] }) {
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const pct = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;
  const currentIndex = milestones.findIndex((m) => m.status === "in_progress");

  if (milestones.length === 0) {
    return (
      <p className="text-sm text-cream/50">
        Progress tracking will appear here once your project team sets up milestones.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-cream/60">Overall progress</span>
        <span className="text-sm font-medium text-gold">{pct}%</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-navy-light">
        <div
          className="h-full rounded-full bg-forest-light transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}>
        {milestones.map((m, i) => {
          const isCompleted = m.status === "completed";
          const isCurrent = i === currentIndex;
          return (
            <div key={m.id} className="text-center">
              <div
                className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  isCompleted
                    ? "bg-forest-light text-white"
                    : isCurrent
                      ? "border-2 border-gold bg-navy-light text-gold"
                      : "border border-black/15 bg-navy-light text-cream/40"
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <p className={`text-[11px] leading-tight ${isCurrent ? "font-medium text-cream" : "text-cream/50"}`}>
                {m.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
