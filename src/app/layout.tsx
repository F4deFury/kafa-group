import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminToolbar from "@/components/AdminToolbar";
import PageTransition from "@/components/PageTransition";
import CookieBanner from "@/components/CookieBanner";
import AuthHashHandler from "@/components/AuthHashHandler";
import { Analytics } from "@vercel/analytics/next";
import TawkLoader from "@/components/TawkLoader";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "KAFA Group | Together Building Communities",
  description:
    "KAFA Group is a premier construction management and general contracting firm based in Bridgeport, Connecticut.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tawkId = process.env.NEXT_PUBLIC_TAWKTO_ID;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let toolbar = null;
  let notifications: {
    id: string;
    title: string;
    body: string | null;
    link: string | null;
    read: boolean;
    created_at: string;
  }[] = [];
  let navAuth: {
    signedIn: boolean;
    destination: string;
    destinationLabel: string;
    role: "client" | "staff" | "management" | null;
    notifications: typeof notifications;
  } = { signedIn: false, destination: "/sign-in", destinationLabel: "Client Sign In", role: null, notifications: [] };

  if (user) {
    const [{ data: profile }, { data: notifRows }] = await Promise.all([
      supabase.from("profiles").select("role, permissions").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("id, title, body, link, read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    notifications = notifRows ?? [];

    if (profile) {
      const isStaffOrManagement = ["staff", "management"].includes(profile.role);
      navAuth = {
        signedIn: true,
        destination: isStaffOrManagement ? "/admin" : "/dashboard",
        destinationLabel: isStaffOrManagement ? "Admin Dashboard" : "Client Dashboard",
        role: profile.role,
        notifications,
      };

      if (isStaffOrManagement) {
        toolbar = (
          <AdminToolbar
            label={profile.role === "management" ? "Management" : "Staff"}
            isManagement={profile.role === "management"}
            permissions={profile.permissions}
          />
        );
      }
    }
  }

  return (
    <html lang="en">
      <body className={`antialiased ${toolbar ? "pb-10" : ""}`}>
        <Navbar auth={navAuth} />
        <main className="pt-20"><PageTransition>{children}</PageTransition></main>
        <Footer />
        {toolbar}
        <AuthHashHandler />
        <CookieBanner />
        {tawkId && <TawkLoader tawkId={tawkId} />}
        <Analytics />
      </body>
    </html>
  );
}
