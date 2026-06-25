import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { ConvexHttpClient } from "convex/browser";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// [FIXED H1] Server-side admin guard — second layer of defense beyond middleware.
// Redirects any non-admin user who somehow bypasses middleware.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    redirect("/signin");
  }

  const user = await convex.query(api.users.current, {}, { authToken: token });
  if (!user || user.role !== "admin") {
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
