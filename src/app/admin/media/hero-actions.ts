"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin-guard";

export async function addHeroSlide(formData: FormData) {
  const supabase = await requirePermission("content");
  const file = formData.get("file") as File;
  const duration = Number(formData.get("duration_seconds")) || 8;

  if (!file || file.size === 0) {
    return { success: false, message: "No file selected." };
  }

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isVideo = ["mp4", "webm", "mov"].includes(ext);
  const path = `hero/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file);
  if (uploadError) return { success: false, message: uploadError.message };

  const { data: urlData } = supabase.storage.from("site-media").getPublicUrl(path);

  const { data: existing } = await supabase.from("hero_slides").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("hero_slides").insert({
    url: urlData.publicUrl,
    media_type: isVideo ? "video" : "image",
    duration_seconds: isVideo ? Math.max(duration, 8) : duration,
    sort_order: nextOrder,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/media");
  revalidatePath("/");
  return { success: true, message: "Slide added." };
}

export async function deleteHeroSlide(formData: FormData) {
  const supabase = await requirePermission("content");
  const id = formData.get("id") as string;
  await supabase.from("hero_slides").delete().eq("id", id);
  revalidatePath("/admin/media");
  revalidatePath("/");
}
