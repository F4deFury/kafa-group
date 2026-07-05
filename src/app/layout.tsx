import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminToolbar from "@/components/AdminToolbar";
import PageTransition from "@/components/PageTransition";
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
  let navAuth = { signedIn: false, destination: "/sign-in", destinationLabel: "Client Sign In" };

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, permissions")
      .eq("id", user.id)
      .single();

    if (profile) {
      const isStaffOrManagement = ["staff", "management"].includes(profile.role);
      navAuth = {
        signedIn: true,
        destination: isStaffOrManagement ? "/admin" : "/dashboard",
        destinationLabel: isStaffOrManagement ? "Admin" : "Dashboard",
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
        {tawkId && (
          <Script id="tawkto" strategy="afterInteractive">
            {`
              var Tawk_API = Tawk_API || {};
              var Tawk_LoadStart = new Date();
              (function () {
                var s1 = document.createElement("script"),
                  s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = 'https://embed.tawk.to/${tawkId}';
                s1.charset = "UTF-8";
                s1.setAttribute("crossorigin", "*");
                s0.parentNode.insertBefore(s1, s0);
              })();
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
