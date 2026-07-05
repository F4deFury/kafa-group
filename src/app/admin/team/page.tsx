import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InviteStaffForm from "./InviteStaffForm";
import StaffRow from "./StaffRow";

export default async function AdminTeam() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "management") redirect("/admin");

  const { data: team } = await supabase
    .from("profiles")
    .select("id, full_name, role, permissions")
    .in("role", ["staff", "management"])
    .order("role");

  return (
    <div>
      <h1 className="text-2xl font-semibold">Team & Permissions</h1>
      <p className="mt-1 text-sm text-cream/60">
        Management-only. Invite staff, assign roles, and toggle exactly what
        each person can access. Changes take effect immediately.
      </p>

      <div className="mt-8">
        <InviteStaffForm />
      </div>

      <div className="section-divider my-8" />

      <div className="space-y-4">
        {(team ?? []).map((p) => (
          <StaffRow key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
}
