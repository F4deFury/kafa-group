import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function Settings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/settings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company, phone")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <p className="mt-1 text-sm text-cream/60">
        Update your account information. This applies to your login regardless
        of your role.
      </p>
      <div className="mt-8">
        <SettingsForm profile={profile ?? { full_name: null, company: null, phone: null }} email={user.email ?? ""} />
      </div>
    </div>
  );
}
