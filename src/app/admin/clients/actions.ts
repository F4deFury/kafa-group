"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function inviteClient(formData: FormData) {
  // Re-verify caller is an admin server-side before using elevated privileges.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, permissions")
    .eq("id", user.id)
    .single();

  const isAuthorized =
    profile?.role === "management" ||
    (profile?.role === "staff" && (profile.permissions as Record<string, boolean>)?.clients);

  if (!isAuthorized) {
    return { success: false, message: "Not authorized." };
  }

  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const company = formData.get("company") as string;

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.user) {
    await admin
      .from("profiles")
      .update({ full_name: fullName, company })
      .eq("id", data.user.id);
  }

  revalidatePath("/admin/clients");
  return { success: true, message: `Invite sent to ${email}.` };
}

export async function removeClientAccount(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, permissions")
    .eq("id", user.id)
    .single();

  const isAuthorized =
    profile?.role === "management" ||
    (profile?.role === "staff" && (profile.permissions as Record<string, boolean>)?.clients);

  if (!isAuthorized) {
    return { success: false, message: "Not authorized." };
  }

  const clientId = formData.get("client_id") as string;
  if (!clientId) return { success: false, message: "Missing client id." };

  const admin = createAdminClient();

  // Unassign any projects pointed at this client first (the FK is
  // ON DELETE SET NULL, but doing it explicitly avoids relying on that
  // silently and keeps the intent obvious here).
  await admin.from("projects").update({ client_id: null }).eq("client_id", clientId);
  await admin.from("profiles").delete().eq("id", clientId);
  await admin.auth.admin.deleteUser(clientId);

  revalidatePath("/admin/clients");
  revalidatePath("/admin/management");
  return { success: true, message: "Client access removed." };
}

export async function assignClientProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, permissions")
    .eq("id", user.id)
    .single();

  const isAuthorized =
    profile?.role === "management" ||
    (profile?.role === "staff" && (profile.permissions as Record<string, boolean>)?.clients);

  if (!isAuthorized) {
    return { success: false, message: "Not authorized." };
  }

  const clientId = formData.get("client_id") as string;
  const projectId = formData.get("project_id") as string;

  if (!projectId) return { success: false, message: "Select a project first." };

  const { error } = await supabase
    .from("projects")
    .update({ client_id: clientId })
    .eq("id", projectId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/clients");
  revalidatePath("/dashboard");
  return { success: true, message: "Project assigned." };
}

export async function unassignClientProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, permissions")
    .eq("id", user.id)
    .single();

  const isAuthorized =
    profile?.role === "management" ||
    (profile?.role === "staff" && (profile.permissions as Record<string, boolean>)?.clients);

  if (!isAuthorized) {
    return { success: false, message: "Not authorized." };
  }

  const clientId = formData.get("client_id") as string;
  const projectId = formData.get("project_id") as string;

  const { error } = await supabase
    .from("projects")
    .update({ client_id: null })
    .eq("id", projectId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/clients");
  revalidatePath("/dashboard");
  return { success: true, message: "Project unassigned." };
}
