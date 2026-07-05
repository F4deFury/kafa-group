"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/admin-guard";

export async function uploadSiteMedia(formData: FormData) {
  const supabase = await requirePermission("content");
  const key = formData.get("key") as string;
  const mediaType = formData.get("media_type") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, message: "No file selected." };
  }

  const ext = file.name.split(".").pop();
  const path = `site/${key}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("site-media")
    .upload(path, file, { upsert: true });

  if (uploadError) return { success: false, message: uploadError.message };

  const { data: urlData } = supabase.storage.from("site-media").getPublicUrl(path);

  const { error } = await supabase
    .from("site_media")
    .upsert({ key, url: urlData.publicUrl, media_type: mediaType, updated_at: new Date().toISOString() });

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/media");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/real-estate");
  return { success: true, message: "Uploaded." };
}
