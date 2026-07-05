import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Permission = "content" | "projects" | "inquiries" | "clients";

export async function requirePermission(permission: Permission) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, permissions")
    .eq("id", user.id)
    .single();

  const isManagement = profile?.role === "management";
  const hasPermission =
    isManagement ||
    (profile?.role === "staff" &&
      (profile.permissions as Record<string, boolean>)?.[permission]);

  if (!hasPermission) redirect("/admin");

  return supabase;
}
