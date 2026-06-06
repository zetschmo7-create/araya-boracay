import type { Metadata } from "next";
import "../admin.css";

export const metadata: Metadata = {
  title: "ARAYA Admin | Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
