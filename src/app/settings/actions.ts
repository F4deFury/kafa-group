"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateOwnProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Not signed in." };

  const full_name = formData.get("full_name") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, company, phone })
    .eq("id", user.id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true, message: "Saved." };
}
