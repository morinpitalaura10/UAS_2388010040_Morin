import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import AdminProvider from "./AdminProvider";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LoginForm />;
  }

  return (
    <AdminProvider session={session}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
