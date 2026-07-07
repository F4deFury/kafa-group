"use client";

import { useTransition } from "react";
import { assignClientProject, unassignClientProject } from "../actions";

type ProjectOption = { id: string; name: string; assignedToThisClient: boolean; assignedElsewhere: boolean };

export default function AssignProjectForm({
  clientId,
  projects,
}: {
  clientId: string;
  projects: ProjectOption[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleAssign(formData: FormData) {
    formData.set("client_id", clientId);
    startTransition(async () => {
      await assignClientProject(formData);
    });
  }

  function handleUnassign(projectId: string) {
    const formData = new FormData();
    formData.set("client_id", clientId);
    formData.set("project_id", projectId);
    startTransition(async () => {
      await unassignClientProject(formData);
    });
  }

  const assigned = projects.filter((p) => p.assignedToThisClient);
  const available = projects.filter((p) => !p.assignedToThisClient);

  return (
    <div>
      {assigned.length > 0 && (
        <div className="mb-4 space-y-2">
          {assigned.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-sm border border-black/10 bg-navy-light px-3 py-2 text-sm">
              <span>{p.name}</span>
              <button
                onClick={() => handleUnassign(p.id)}
                disabled={isPending}
                className="text-xs text-red-500 hover:text-red-600 disabled:opacity-60"
              >
                Unassign
              </button>
            </div>
          ))}
        </div>
      )}

      <form action={handleAssign} className="flex gap-2">
        <select
          name="project_id"
          defaultValue=""
          className="flex-1 rounded-sm border border-black/15 bg-navy-light px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
        >
          <option value="" disabled>
            Assign another project...
          </option>
          {available.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.assignedElsewhere ? " (currently assigned to another client)" : ""}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-navy hover:bg-gold-light disabled:opacity-60"
        >
          Assign
        </button>
      </form>
    </div>
  );
}
