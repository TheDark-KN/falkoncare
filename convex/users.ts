import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Diagnostic: returns the raw Convex auth identity.
export const whoami = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { authenticated: false as const, identity: null };
    }
    return {
      authenticated: true as const,
      identity: {
        subject: identity.subject,
        email: identity.email ?? null,
        name: identity.name ?? null,
        pictureUrl: identity.pictureUrl ?? null,
        issuer: identity.issuer ?? null,
      },
    };
  },
});

// Get current user from Convex Auth
export const current = query({
  args: {},
  handler: async (ctx: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    return user;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    dob: v.optional(v.string()),
  },
  handler: async (ctx: any, { fullName, name, address, phoneNumber, dob }: { fullName?: string, name?: string, address?: string, phoneNumber?: string, dob?: string }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update profile fields, maintaining backward compatibility between name & fullName
    const updatedName = name || fullName || user.name || user.fullName || "";
    const updatedPhone = phoneNumber || user.phoneNumber || user.phone || "";

    await ctx.db.patch(user._id, {
      name: updatedName,
      fullName: updatedName,
      address: address !== undefined ? address : user.address,
      phoneNumber: updatedPhone,
      phone: updatedPhone,
      dob: dob !== undefined ? dob : user.dob,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Update wallet balance (internal mutation called after payment confirmation)
export const updateWalletBalance = internalMutation({
  args: {
    amount: v.number(),
    userId: v.string(), // Convex user ID (string representation of Id<"users">)
  },
  handler: async (ctx: any, { amount, userId }: { amount: number, userId: string }) => {
    const user = await ctx.db.get(userId as any);
    if (!user) {
      throw new Error("User not found");
    }

    const newBalance = (user.walletBalance || 0) + amount;
    if (newBalance < 0) {
      throw new Error("Insufficient balance");
    }

    await ctx.db.patch(user._id, {
      walletBalance: newBalance,
      updatedAt: Date.now(),
    });

    return newBalance;
  },
});

// Admin: list all users
export const listAll = query({
  args: {},
  handler: async (ctx: any) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const caller = await ctx.db.get(userId);
    if (!caller || caller.role !== "admin") throw new Error("Unauthorized");

    return await ctx.db.query("users").collect();
  },
});

// Developer mutation: grant admin role
export const makeUserAdmin = mutation({
  args: {
    userId: v.id("users"),
    secret: v.string(),
  },
  handler: async (ctx: any, { userId, secret }: { userId: any, secret: string }) => {
    if (secret !== "falkon2024") {
      throw new Error("Invalid secret");
    }
    await ctx.db.patch(userId, {
      role: "admin",
    });
    return true;
  },
});
