import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/signin", "/signup", "/about", "/services"]);
const isAuthRoute = createRouteMatcher(["/signin", "/signup"]);
const isAdminRoute = createRouteMatcher(["/admin", "/admin/(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthed = await convexAuth.isAuthenticated();
  if (isAuthRoute(request) && isAuthed) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
  if (isAdminRoute(request)) {
    const token = await convexAuth.getToken();
    if (!token) return nextjsMiddlewareRedirect(request, "/signin");
  }
  if (!isPublicRoute(request) && !isAuthed) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
}, { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } });

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
