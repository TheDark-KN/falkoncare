import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    bookings: defineTable({
        userId: v.string(), // Clerk User ID
        serviceName: v.string(),
        date: v.number(), // Timestamp
        time: v.string(),
        amount: v.number(),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("in-progress"),
            v.literal("completed"),
            v.literal("cancelled")
        ),
        address: v.string(),
        tankSize: v.optional(v.string()), // e.g., "1000 - 2000 L"
        tankType: v.optional(v.string()), // e.g., "Overhead"
        paymentStatus: v.optional(v.string()),
    })
        .index("by_user", ["userId"])
        .index("by_status", ["status"]),

    users: defineTable({
        // Clerk fields
        clerkId: v.string(), // Clerk User ID
        email: v.string(),
        fullName: v.optional(v.string()),
        imageUrl: v.optional(v.string()),

        // App specific fields
        // [FIXED M5] Role is now a constrained union — not any string
        role: v.optional(v.union(v.literal("admin"), v.literal("user"), v.literal("staff"))),
        walletBalance: v.optional(v.number()),
        address: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
        // [FIXED C3] Tracks processed Razorpay payment IDs to prevent replay attacks
        processedPaymentIds: v.optional(v.array(v.string())),
    })
        .index("by_clerk_id", ["clerkId"])
        .index("by_email", ["email"]),
});
