"use client";

import { useTransition } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { addMilestone, updateMilestoneStatus, deleteMilestone } from "./actions";

type Milestone = {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "completed";
  sort_order: number;
};

const statusLabel: Record<Milestone["status"], string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function MilestoneManager({
  projectId,
  milestones,
}: {
  projectId: string;
  milestones: Milestone[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(milestoneId: string, status: string) {
    const formData = new FormData();
    formData.set("project_id", projectId);
    formData.set("milestone_id", milestoneId);
    formData.set("status", status);
    startTransition(async () => {
      await updateMilestoneStatus(formData);
    });
  }

  function handleDelete(milestoneId: string) {
    if (!window.confirm("Remove this milestone? The client will no longer see it.")) return;
    const formData = new FormData();
    formData.set("project_id", projectId);
    formData.set("milestone_id", milestoneId);
    startTransition(async () => {
      await deleteMilestone(formData);
    });
  }

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const pct = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-cream/60">
          Overall progress shown to the client: <span className="font-medium text-gold">{pct}%</span> ({completedCount}/{milestones.length} milestones complete)
        </p>
      </div>

      <div className="space-y-2">
        {milestones
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-md border border-black/10 bg-navy-card p-3"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-cream/30" />
              <p className="flex-1 text-sm">{m.name}</p>
              <select
                defaultValue={m.status}
                disabled={isPending}
                onChange={(e) => handleStatusChange(m.id, e.target.value)}
                className="rounded-sm border border-black/15 bg-navy-light px-2 py-1 text-xs text-cream focus:border-gold focus:outline-none"
              >
                {Object.entries(statusLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleDelete(m.id)}
                disabled={isPending}
                className="rounded-sm p-1.5 text-cream/40 hover:bg-red-500/10 hover:text-red-500"
                aria-label="Delete milestone"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        {milestones.length === 0 && (
          <p className="text-sm text-cream/50">No milestones yet — add the project&rsquo;s phases below.</p>
        )}
      </div>

      <form action={addMilestone} className="mt-4 flex gap-2">
        <input type="hidden" name="project_id" value={projectId} />
        <input
          name="name"
          placeholder="e.g. Framing, Electrical Rough-In, Final Inspection"
          className="flex-1 rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light"
        >
          Add Milestone
        </button>
      </form>
    </div>
  );
}
