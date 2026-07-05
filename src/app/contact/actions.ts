"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("contact_submissions").insert({
    company: formData.get("company") as string,
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    message: formData.get("message") as string,
  });

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Thanks — we'll be in touch shortly." };
}
