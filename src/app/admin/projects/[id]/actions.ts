"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin-guard";

export async function uploadProjectImage(formData: FormData) {
  const supabase = await requirePermission("projects");
  const projectId = formData.get("project_id") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, message: "No file selected." };
  }

  const ext = file.name.split(".").pop();
  const path = `projects/${projectId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file);
  if (uploadError) return { success: false, message: uploadError.message };

  const { data: urlData } = supabase.storage.from("site-media").getPublicUrl(path);

  const { error } = await supabase
    .from("project_images")
    .insert({ project_id: projectId, url: urlData.publicUrl });

  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
  return { success: true, message: "Photo added." };
}

export async function deleteProjectImage(formData: FormData) {
  const supabase = await requirePermission("projects");
  const imageId = formData.get("image_id") as string;
  const projectId = formData.get("project_id") as string;

  await supabase.from("project_images").delete().eq("id", imageId);

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
}
