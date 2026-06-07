// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Convex auth config — drives how Convex validates Clerk JWTs.
//
// Two things must match exactly between Clerk and this file:
//
//   1. The Clerk JWT template name.  Clerk's template that issues
//      short-lived JWTs for Convex must be named exactly "convex"
//      (this matches the `applicationID` below).
//
//   2. The Clerk issuer domain.  Set `CLERK_JWT_ISSUER_DOMAIN` in
//      your Convex deployment's environment variables (Convex
//      dashboard → Settings → Environment Variables).  It must be
//      the full https URL of your Clerk Frontend API, e.g.
//
//          https://rested-phoenix-52.clerk.accounts.dev
//
//      You can find it in the Clerk dashboard under
//      "API Keys → Show JWT public key" or by decoding the
//      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (base64 of the domain).
//
// If either of these is wrong, every Convex mutation will throw
// "UNAUTHENTICATED" even when the user is signed in to Clerk.

const FALLBACK_CLERK_DOMAIN = "https://rested-phoenix-52.clerk.accounts.dev";

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || FALLBACK_CLERK_DOMAIN,
      applicationID: "convex",
    },
  ],
};
