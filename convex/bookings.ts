import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

// Error constants for consistent error handling
export const ERRORS = {
    INSUFFICIENT_WALLET_BALANCE: "INSUFFICIENT_WALLET_BALANCE",
    UNAUTHENTICATED: "UNAUTHENTICATED",
    UNAUTHORIZED: "UNAUTHORIZED",
    BOOKING_NOT_FOUND: "BOOKING_NOT_FOUND",
    CANNOT_CANCEL: "CANNOT_CANCEL",
} as const;

// Public query to get all bookings (admin only, but kept public for demo)
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("bookings").collect();
    },
});

// Get bookings for current user
export const getByUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        return await ctx.db
            .query("bookings")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .collect();
    },
});

// Get bookings by specific user ID (admin function)
export const getByUserId = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("bookings")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
    },
});

// Create a new booking
export const create = mutation({
    args: {
        serviceName: v.string(),
        date: v.number(),
        time: v.string(),
        amount: v.number(),
        address: v.string(),
        tankSize: v.optional(v.string()),
        tankType: v.optional(v.string()),
        paymentMethod: v.union(v.literal("cash"), v.literal("wallet"), v.literal("upi"), v.literal("card"), v.literal("netbanking")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        console.log("identity in bookings:create", identity);
        if (!identity) {
            throw new ConvexError(ERRORS.UNAUTHENTICATED);
        }

        // Get user to check wallet balance if paying with wallet
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        // Handle payment logic
        let paymentStatus = "pending";
        
        if (args.paymentMethod === "wallet") {
            if (!user || !user.walletBalance || user.walletBalance < args.amount) {
                throw new ConvexError(ERRORS.INSUFFICIENT_WALLET_BALANCE);
            }
            // Deduct from wallet
            await ctx.db.patch(user._id, {
                walletBalance: (user.walletBalance || 0) - args.amount,
                updatedAt: Date.now(),
            });
            paymentStatus = "paid";
        } else if (["upi", "card", "netbanking"].includes(args.paymentMethod)) {
            // Online payments via Razorpay are captured frontend-side before hitting this mutation
            paymentStatus = "paid";
        }

        const bookingId = await ctx.db.insert("bookings", {
            userId: identity.subject,
            serviceName: args.serviceName,
            date: args.date,
            time: args.time,
            amount: args.amount,
            address: args.address,
            tankSize: args.tankSize,
            tankType: args.tankType,
            status: "pending", // Start as pending, admin confirms
            paymentStatus: paymentStatus,
        });

        return bookingId;
    },
});

// Update booking status (admin)
export const updateStatus = mutation({
    args: {
        id: v.id("bookings"),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("in-progress"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
    },
    handler: async (ctx, args) => {
        // TODO: Add admin role check
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        await ctx.db.patch(args.id, { status: args.status });
    },
});

// Cancel booking (user can cancel their own booking)
export const cancel = mutation({
    args: {
        id: v.id("bookings"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const booking = await ctx.db.get(args.id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        if (booking.userId !== identity.subject) {
            throw new Error("Unauthorized to cancel this booking");
        }

        if (booking.status === "completed" || booking.status === "in-progress") {
            throw new Error("Cannot cancel booking in progress or completed");
        }

        // If paid via wallet, refund the amount
        if (booking.paymentStatus === "paid") {
            const user = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
                .first();

            if (user) {
                await ctx.db.patch(user._id, {
                    walletBalance: (user.walletBalance || 0) + booking.amount,
                    updatedAt: Date.now(),
                });
            }
        }

        await ctx.db.patch(args.id, {
            status: "cancelled",
            paymentStatus: "refunded"
        });
    },
});

// Get booking by ID
export const getById = query({
    args: { id: v.id("bookings") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
