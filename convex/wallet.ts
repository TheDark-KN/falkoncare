import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getBalance = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    // If the database sync hasn't occurred yet, return a safe 0 balance 
    // to prevent component hydration/runtime crashes
    if (!user) return 0;

    return user.walletBalance || 0;
  },
});

export const addBalance = mutation({
  args: {
    amount: v.number(),
    paymentId: v.string(), // Razorpay payment ID
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    // If user record doesn't exist (e.g., Clerk webhook sync delay), create a safe scaffold record
    if (!user) {
      const newUserId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email || "unknown@falkoncare.com",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        walletBalance: 0,
      });
      user = await ctx.db.get(newUserId);
    }

    if (!user) throw new Error("Failed to secure user wallet record");

    const currentBalance = user.walletBalance || 0;
    
    // Process top-up
    await ctx.db.patch(user._id, {
      walletBalance: currentBalance + args.amount,
      updatedAt: Date.now()
    });

    return { success: true, newBalance: currentBalance + args.amount };
  },
});
