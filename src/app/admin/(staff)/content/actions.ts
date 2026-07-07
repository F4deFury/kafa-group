"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateContent(formData: FormData) {
  const supabase = await createClient();
  const key = formData.get("key") as string;
  const value = formData.get("value") as string;

  await supabase
    .from("site_content")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key);

  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/about");
}
