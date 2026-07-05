"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function upsertProject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const payload = {
    name: formData.get("name") as string,
    location: formData.get("location") as string,
    description: formData.get("description") as string,
    published: formData.get("published") === "on",
  };

  if (id) {
    await supabase.from("projects").update(payload).eq("id", id);
  } else {
    await supabase.from("projects").insert(payload);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
