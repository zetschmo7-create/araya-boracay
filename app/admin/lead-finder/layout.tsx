import { AdminShell } from "../components/AdminShell";

export default function LeadFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
