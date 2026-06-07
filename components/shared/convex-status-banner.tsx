"use client";

import { useEffect, useState } from "react";
import { checkConvexHealth, type ConvexHealth } from "@/lib/convex-health";

/**
 * Non-blocking banner that surfaces the real reason a Convex call is
 * failing. The previous implementation used an error boundary that matched
 * on the phrase "Could not find public function" — any error containing
 * that phrase (regardless of its true cause) would replace the entire
 * page with a scary "Database Sync Needed" screen.
 *
 * This banner does not block rendering: the page still loads and the
 * surveyor can still fill in the form. The banner only informs the user
 * that server-side persistence is not yet available.
 */
export function ConvexStatusBanner() {
  const [health, setHealth] = useState<ConvexHealth | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    let cancelled = false;
    checkConvexHealth(url).then((result) => {
      if (!cancelled) setHealth(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!health || health.ok || dismissed) return null;

  if (health.reason === "missing-url") {
    return (
      <div
        role="alert"
        className="bg-amber-500 text-white text-sm font-medium py-2 px-4 flex items-center justify-between gap-3"
      >
        <span>
          ⚠️ <code className="font-mono">NEXT_PUBLIC_CONVEX_URL</code> is
          not set. Survey submissions cannot be saved.
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white text-xs"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (health.reason === "no-function") {
    return (
      <div
        role="alert"
        className="bg-amber-500 text-white text-sm font-medium py-2 px-4"
      >
        <div className="flex items-center justify-between gap-3">
          <span>
            ⚠️ Convex functions are not yet deployed to this environment.
            Form entries will be queued locally and submitted after deploy.
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white text-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (health.reason === "network") {
    return (
      <div
        role="alert"
        className="bg-amber-500 text-white text-sm font-medium py-2 px-4 flex items-center justify-between gap-3"
      >
        <span>⚠️ Cannot reach the Convex backend: {health.message}</span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white text-xs"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return null;
}
