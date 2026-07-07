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

export async function addMilestone(formData: FormData) {
  const supabase = await requirePermission("projects");
  const projectId = formData.get("project_id") as string;
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  const { count } = await supabase
    .from("project_milestones")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  await supabase.from("project_milestones").insert({
    project_id: projectId,
    name,
    sort_order: count ?? 0,
  });

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function updateMilestoneStatus(formData: FormData) {
  const supabase = await requirePermission("projects");
  const projectId = formData.get("project_id") as string;
  const milestoneId = formData.get("milestone_id") as string;
  const status = formData.get("status") as string;

  await supabase
    .from("project_milestones")
    .update({
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", milestoneId);

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function deleteMilestone(formData: FormData) {
  const supabase = await requirePermission("projects");
  const projectId = formData.get("project_id") as string;
  const milestoneId = formData.get("milestone_id") as string;

  await supabase.from("project_milestones").delete().eq("id", milestoneId);

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function postProjectUpdate(formData: FormData) {
  const supabase = await requirePermission("projects");
  const projectId = formData.get("project_id") as string;
  const note = (formData.get("note") as string)?.trim();
  const notifyClient = formData.get("notify_client") === "on";
  if (!note) return;

  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("project_updates").insert({
    project_id: projectId,
    note,
    notify_client: notifyClient,
    created_by: user?.id ?? null,
  });

  if (notifyClient) {
    const { data: project } = await supabase
      .from("projects")
      .select("client_id, name")
      .eq("id", projectId)
      .single();

    if (project?.client_id) {
      await supabase.from("notifications").insert({
        user_id: project.client_id,
        title: `Update on ${project.name}`,
        body: note,
        link: `/dashboard`,
      });
    }
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/dashboard");
}
