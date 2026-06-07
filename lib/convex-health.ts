/**
 * Lightweight Convex deployment health check used by the client.
 *
 * The error boundary's text-matching is fragile: any error that happens to
 * contain "Could not find public function" would be misclassified as a
 * "Database Sync Needed" problem. This helper instead actively probes the
 * configured Convex deployment and reports the real reason the page is
 * broken.
 */

export type ConvexHealth =
  | { ok: true }
  | { ok: false; reason: "missing-url" }
  | { ok: false; reason: "no-function"; message: string }
  | { ok: false; reason: "network"; message: string }
  | { ok: false; reason: "unknown"; message: string };

/**
 * Probe a known public query on the configured Convex deployment.
 *
 * `surveys:getSocieties` is intentionally chosen because it is the simplest
 * read-only query in this project and requires no auth. It exists in every
 * environment where the backend has been deployed.
 */
export async function checkConvexHealth(
  convexUrl: string | undefined,
  timeoutMs = 5000,
): Promise<ConvexHealth> {
  if (!convexUrl || !convexUrl.startsWith("http")) {
    return { ok: false, reason: "missing-url" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${convexUrl.replace(/\/$/, "")}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "surveys:getSocieties",
        args: [{}],
        format: "json",
      }),
      signal: controller.signal,
    });

    const text = await res.text();
    let payload: { status?: string; errorMessage?: string } = {};
    try {
      payload = JSON.parse(text);
    } catch {
      return {
        ok: false,
        reason: "unknown",
        message: text || `HTTP ${res.status}`,
      };
    }

    if (payload.status === "success") {
      return { ok: true };
    }

    const message = payload.errorMessage || `HTTP ${res.status}`;
    if (
      message.toLowerCase().includes("could not find public function") ||
      message.toLowerCase().includes("did you forget to run")
    ) {
      return { ok: false, reason: "no-function", message };
    }

    return { ok: false, reason: "unknown", message };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to reach Convex";
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, reason: "network", message: "Request timed out" };
    }
    return { ok: false, reason: "network", message };
  } finally {
    clearTimeout(timer);
  }
}
