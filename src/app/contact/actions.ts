"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: FormData) {
  // Honeypot: a hidden field real visitors never fill in. If it has a value,
  // this is almost certainly a bot — silently pretend success so bots don't
  // learn to avoid the field, but don't actually write to the database.
  const honeypot = formData.get("website") as string;
  if (honeypot) {
    return { success: true, message: "Thanks — we'll be in touch shortly." };
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const message = (formData.get("message") as string)?.trim();

  if (!email || !message) {
    return { success: false, message: "Please fill in all required fields." };
  }

  const supabase = await createClient();

  // Basic rate limit: block if this email has submitted 3+ times in the
  // last 10 minutes, to slow down repeated spam/abuse.
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", tenMinutesAgo);

  if ((count ?? 0) >= 3) {
    return {
      success: false,
      message: "You've submitted several messages recently. Please wait a few minutes and try again, or call us directly.",
    };
  }

  const { error } = await supabase.from("contact_submissions").insert({
    company: formData.get("company") as string,
    full_name: formData.get("full_name") as string,
    email,
    phone: formData.get("phone") as string,
    message,
  });

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Thanks — we'll be in touch shortly." };
}
