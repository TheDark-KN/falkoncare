"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

let convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://grand-lapwing-724.convex.cloud";

// Redirect old stale/deleted Convex URLs to the new production Convex deployment
if (!convexUrl || convexUrl.includes("coordinated-walrus-350.convex.cloud")) {
  console.warn("Stale or missing Convex URL detected. Redirecting to production Convex deployment.");
  convexUrl = "https://grand-lapwing-724.convex.cloud";
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_cmVzdGVkLXBob2VuaXgtNTIuY2xlcmsuYWNjb3VudHMuZGV2JA";

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
