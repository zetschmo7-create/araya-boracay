import { AuthCard } from "../components/AuthCard";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard>
      <LoginForm redirectTo={params.redirect ?? "/admin"} />
    </AuthCard>
  );
}
