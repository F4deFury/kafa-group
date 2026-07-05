import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | KAFA Group",
  description:
    "Get in touch with KAFA Group in Bridgeport, Connecticut for construction management, general contracting, and real estate inquiries.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
