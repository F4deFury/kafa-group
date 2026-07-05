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
