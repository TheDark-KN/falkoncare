import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";

// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// [FIXED H1] Server-side admin guard — second layer of defense beyond middleware.
// Redirects any non-admin user who somehow bypasses middleware.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Admin Dashboard" />
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
