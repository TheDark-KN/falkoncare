"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const CLERK_PUBLISHABLE_KEY_FALLBACK =
  "pk_test_cmVzdGVkLXBob2VuaXgtNTIuY2xlcmsuYWNjb3VudHMuZGV2JA";

function resolveConvexUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }

  if (typeof window !== "undefined") {
    // Hard fail-fast on the client when env var is missing instead of
    // silently pointing to an arbitrary deployment.
    console.error(
      "[Convex] NEXT_PUBLIC_CONVEX_URL is not defined. " +
        "Set it in .env.local (and in Vercel/Convex env) before deploying."
    );
  }
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not defined. Set it in .env.local and in your deployment environment."
  );
}

const convex = new ConvexReactClient(resolveConvexUrl(), { unsavedChangesWarning: false });

if (typeof window !== "undefined") {
  console.log(
    "[Convex] Client connected to:",
    process.env.NEXT_PUBLIC_CONVEX_URL
  );
}

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const clerkPublishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY_FALLBACK;

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
