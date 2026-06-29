import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ConvexHttpClient } from "convex/browser";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";

// Force dynamic rendering for all admin pages
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server-side admin guard — second layer of defense beyond proxy.
// Redirects any non-admin user who somehow bypasses the proxy.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = await convexAuthNextjsToken();
  if (!token) {
    redirect("/signin");
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  convex.setAuth(token);

  const user = await convex.mutation(api.users.checkAndPromoteAdmin);
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex flex-col lg:pl-60 md:pl-16 pl-0 pb-20 md:pb-0 pt-0">
      <Sidebar userRole="admin" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
