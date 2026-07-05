import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Sign In | KAFA Group",
  robots: { index: false, follow: false },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
