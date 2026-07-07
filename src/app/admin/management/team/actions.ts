"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireManagement() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "management" ? supabase : null;
}

export async function inviteStaff(formData: FormData) {
  const supabase = await requireManagement();
  if (!supabase) return { success: false, message: "Not authorized." };

  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string; // 'staff' | 'management'
  const permissions = {
    content: formData.get("perm_content") === "on",
    projects: formData.get("perm_projects") === "on",
    inquiries: formData.get("perm_inquiries") === "on",
    clients: formData.get("perm_clients") === "on",
  };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });

  if (error) return { success: false, message: error.message };

  if (data.user) {
    await admin
      .from("profiles")
      .update({ full_name: fullName, role, permissions })
      .eq("id", data.user.id);
  }

  revalidatePath("/admin/management/team");
  return { success: true, message: `Invite sent to ${email}.` };
}

export async function updateStaffAccess(formData: FormData) {
  const supabase = await requireManagement();
  if (!supabase) return { success: false, message: "Not authorized." };

  const id = formData.get("id") as string;
  const role = formData.get("role") as string;
  const permissions = {
    content: formData.get("perm_content") === "on",
    projects: formData.get("perm_projects") === "on",
    inquiries: formData.get("perm_inquiries") === "on",
    clients: formData.get("perm_clients") === "on",
  };

  await supabase.from("profiles").update({ role, permissions }).eq("id", id);

  revalidatePath("/admin/management/team");
  return { success: true, message: "Updated." };
}
