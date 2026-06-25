import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getBalance = query({
  args: {},
  handler: async (ctx: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const user = await ctx.db.get(userId);
    if (!user) return 0;

    return user.walletBalance || 0;
  },
});

// addBalance verifies Razorpay payment signature before crediting wallet
export const addBalance = mutation({
  args: {
    amount: v.number(),
    paymentId: v.string(),   // Razorpay payment ID (pay_xxx)
    orderId: v.string(),     // Razorpay order ID (order_xxx)
    signature: v.string(),   // HMAC-SHA256 signature from Razorpay callback
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    // Validate amount bounds (₹1 – ₹100,000)
    if (args.amount <= 0 || args.amount > 100000) {
      throw new Error("Invalid top-up amount");
    }

    // Verify Razorpay payment signature using HMAC-SHA256
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Payment configuration error");

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(`${args.orderId}|${args.paymentId}`)
    );
    const expectedSignature = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== args.signature) {
      throw new Error("Payment signature verification failed");
    }

    // Guard against replay attacks — check if paymentId was already processed
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Store processed payment IDs to prevent replay
    const processedIds: string[] = user.processedPaymentIds || [];
    if (processedIds.includes(args.paymentId)) {
      throw new Error("Payment already processed");
    }

    const currentBalance = user.walletBalance || 0;

    // Credit wallet and record this paymentId as processed
    await ctx.db.patch(user._id, {
      walletBalance: currentBalance + args.amount,
      updatedAt: Date.now(),
      processedPaymentIds: [...processedIds, args.paymentId],
    });

    return { success: true, newBalance: currentBalance + args.amount };
  },
});
