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


export async function uploadProjectDocument(formData: FormData) {
  const supabase = await requirePermission("projects");
  const projectId = formData.get("project_id") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, message: "No file selected." };
  }

  const { data: { user } } = await supabase.auth.getUser();
  const path = `${projectId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("project-documents")
    .upload(path, file);
  if (uploadError) return { success: false, message: uploadError.message };

  const { error } = await supabase.from("project_documents").insert({
    project_id: projectId,
    name: file.name,
    storage_path: path,
    uploaded_by: user?.id ?? null,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Document uploaded." };
}

export async function deleteProjectDocument(formData: FormData) {
  const supabase = await requirePermission("projects");
  const documentId = formData.get("document_id") as string;
  const projectId = formData.get("project_id") as string;
  const storagePath = formData.get("storage_path") as string;

  await supabase.storage.from("project-documents").remove([storagePath]);
  await supabase.from("project_documents").delete().eq("id", documentId);

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/dashboard");
}
