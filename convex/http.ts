import { httpRouter } from "convex/server";
import { httpAction, type MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// [FIXED C2] Clerk webhook handler — now verifies Svix signature before processing.
// Uses HMAC-SHA256 via Web Crypto API (Svix-compatible verification).
http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx: MutationCtx, request: Request) => {
    const payloadString = await request.text();

    // Extract required Svix headers
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    // Verify Svix signature using HMAC-SHA256
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response("Webhook secret not configured", { status: 500 });
    }

    try {
      const isValid = await verifySvixSignature(
        payloadString,
        svixId,
        svixTimestamp,
        svixSignature,
        webhookSecret
      );

      if (!isValid) {
        return new Response("Invalid webhook signature", { status: 401 });
      }

      const payload = JSON.parse(payloadString);
      const { type, data } = payload;

      switch (type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            clerkId: data.id,
            email: data.email_addresses?.[0]?.email_address || "",
            fullName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            imageUrl: data.image_url,
          });
          break;

        case "user.updated":
          await ctx.runMutation(internal.users.updateUser, {
            clerkId: data.id,
            email: data.email_addresses?.[0]?.email_address || "",
            fullName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            imageUrl: data.image_url,
          });
          break;

        case "user.deleted":
          await ctx.runMutation(internal.users.deleteUser, {
            clerkId: data.id,
          });
          break;

        default:
          // Silently ignore unhandled event types
          break;
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      return new Response("Webhook processing failed", { status: 400 });
    }
  }),
});

/**
 * Verifies a Svix webhook signature using HMAC-SHA256.
 * Svix message-to-sign format: "{svix-id}.{svix-timestamp}.{payload}"
 * Svix secret format: "whsec_<base64-encoded-secret>"
 */
async function verifySvixSignature(
  payload: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
  secret: string
): Promise<boolean> {
  // Decode the base64 Svix secret (strip "whsec_" prefix)
  const base64Secret = secret.startsWith("whsec_")
    ? secret.slice(6)
    : secret;

  const secretBytes = Uint8Array.from(atob(base64Secret), (c) =>
    c.charCodeAt(0)
  );

  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const toSign = `${svixId}.${svixTimestamp}.${payload}`;
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(toSign)
  );

  const computedSig = btoa(String.fromCharCode(...new Uint8Array(mac)));

  // Svix may send multiple signatures ("v1,sig1 v1,sig2") — check all
  const providedSignatures = svixSignature.split(" ");
  return providedSignatures.some((sig) => sig === `v1,${computedSig}`);
}

export default http;
