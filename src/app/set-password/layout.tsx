import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Your Password | KAFA Group",
  robots: { index: false, follow: false },
};

export default function SetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
