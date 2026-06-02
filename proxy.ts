import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/admin(.*)',
    '/api/razorpay(.*)', // API routes require authentication
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
    // Require authentication on all protected routes
    if (isProtectedRoute(req)) await auth.protect();

    // Admin routes require publicMetadata.role === "admin" (set via Clerk Dashboard)
    if (isAdminRoute(req)) {
        const { sessionClaims } = await auth();
        const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
        if (role !== "admin") {
            const dashboardUrl = new URL('/dashboard', req.url);
            return NextResponse.redirect(dashboardUrl);
        }
    }

    // CSRF protection on state-changing API routes: Origin must match Host
    if (req.method !== "GET" && req.nextUrl.pathname.startsWith('/api/')) {
        const origin = req.headers.get("origin");
        const host = req.headers.get("host");
        if (origin && host) {
            const originHost = new URL(origin).host;
            if (originHost !== host) {
                return new NextResponse("Forbidden: CSRF check failed", { status: 403 });
            }
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
