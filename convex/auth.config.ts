// [FIXED M6] Clerk JWT domain is now driven by environment variable.
// Set CLERK_JWT_ISSUER_DOMAIN in your Convex dashboard environment variables.
export default {
    providers: [
        {
            domain: process.env.CLERK_JWT_ISSUER_DOMAIN ?? "https://rested-phoenix-52.clerk.accounts.dev",
            applicationID: "convex",
        },
    ],
};
