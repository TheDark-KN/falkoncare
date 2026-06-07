import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Diagnostic: returns the raw Convex auth identity. Useful from the client
// to verify that the Clerk → Convex JWT pipeline is wired up correctly.
// Returns { authenticated: false } when there is no signed-in user.
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

// Get current user from Clerk
export const current = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      // Return basic info if user not found in our table
      return {
        clerkId: identity.subject,
        email: identity.email || "",
        fullName: identity.name || "",
        imageUrl: identity.pictureUrl || "",
        role: "user",
        walletBalance: 0,
      };
    }

    return user;
  },
});

// [FIXED H3] Get user by Clerk ID — now requires auth; only self or admin allowed
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx: any, { clerkId }: { clerkId: string }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Allow access only to own profile or admin
    if (identity.subject !== clerkId) {
      const caller = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
        .first();
      if (!caller || caller.role !== "admin") throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", clerkId))
      .first();
  },
});

// Ensure user exists in Convex (called from client)
export const ensureUser = mutation({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    // [FIXED M7] Removed console.log that leaked JWT identity data
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
      .first();

    if (user) {
      // [FIXED H2] Removed "hack for testing" wallet auto-refill
      return user._id;
    }

    // Create new user with zero starting balance — wallet is topped up via real payments only
    const now = Date.now();
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email || "",
      fullName: identity.name || "",
      imageUrl: identity.pictureUrl || "",
      role: "user",
      walletBalance: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Create user (called by webhook)
export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, { clerkId, email, fullName, imageUrl }: { clerkId: string, email: string, fullName?: string, imageUrl?: string }) => {
    const now = Date.now();

    return await ctx.db.insert("users", {
      clerkId,
      email,
      fullName: fullName || "",
      imageUrl: imageUrl || "",
      role: "user",
      walletBalance: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update user (called by webhook)
export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, { clerkId, email, fullName, imageUrl }: { clerkId: string, email: string, fullName?: string, imageUrl?: string }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", clerkId))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        email,
        fullName: fullName || user.fullName,
        imageUrl: imageUrl || user.imageUrl,
        updatedAt: Date.now(),
      });
    }
  },
});

// Delete user (called by webhook)
export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx: any, { clerkId }: { clerkId: string }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", clerkId))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    address: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
  },
  handler: async (ctx: any, { fullName, address, phoneNumber }: { fullName?: string, address?: string, phoneNumber?: string }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      // Create user if doesn't exist — start with zero balance
      return await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email || "",
        fullName: fullName || identity.name || "",
        imageUrl: identity.pictureUrl || "",
        role: "user",
        walletBalance: 0, // [FIXED H2] No hardcoded free balance
        address,
        phoneNumber,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Update existing user
    await ctx.db.patch(user._id, {
      ...(fullName !== undefined && { fullName }),
      ...(address !== undefined && { address }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// [FIXED C4] updateWalletBalance is now internalMutation — not callable from client
// Use wallet.addBalance (with Razorpay signature verification) to credit wallets
export const updateWalletBalance = internalMutation({
  args: {
    amount: v.number(),
    userId: v.string(),
  },
  handler: async (ctx: any, { amount, userId }: { amount: number, userId: string }) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", userId))
      .first();

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

// Admin: list all users (admin only)
export const listAll = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const caller = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
      .first();

    if (!caller || caller.role !== "admin") throw new Error("Unauthorized");

    return await ctx.db.query("users").collect();
  },
});


