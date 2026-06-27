import "./env";
import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Error constants for consistent error handling
export const ERRORS = {
    INSUFFICIENT_WALLET_BALANCE: "INSUFFICIENT_WALLET_BALANCE",
    UNAUTHENTICATED: "UNAUTHENTICATED",
    UNAUTHORIZED: "UNAUTHORIZED",
    BOOKING_NOT_FOUND: "BOOKING_NOT_FOUND",
    CANNOT_CANCEL: "CANNOT_CANCEL",
} as const;

// Minimum and maximum booking amounts (INR) — server-side price guard
const MIN_BOOKING_AMOUNT = 99;    // ₹99 minimum
const MAX_BOOKING_AMOUNT = 50000; // ₹50,000 maximum

// Internal helper: verify caller is an admin
async function assertAdmin(ctx: { auth: any; db: any }) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError(ERRORS.UNAUTHENTICATED);
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new ConvexError(ERRORS.UNAUTHORIZED);
    return { userId, user };
}

// Internal helper: verify caller is authenticated
async function assertAuth(ctx: { auth: any }) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError(ERRORS.UNAUTHENTICATED);
    return userId;
}

// Internal helper: verify Razorpay HMAC signature using Web Crypto API
async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${orderId}|${paymentId}`)
  );
  const expectedSignature = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedSignature === signature;
}

// Admin-only query to get all bookings
export const get = query({
    args: {},
    handler: async (ctx: any) => {
        await assertAdmin(ctx);
        return await ctx.db.query("bookings").collect();
    },
});

// Get bookings for current user
export const getByUser = query({
    args: {},
    handler: async (ctx: any) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }
        return await ctx.db
            .query("bookings")
            .withIndex("by_user", (q: any) => q.eq("userId", userId))
            .collect();
    },
});

// Get bookings by specific user ID — requires admin role
export const getByUserId = query({
    args: { userId: v.string() },
    handler: async (ctx: any, { userId }: { userId: string }) => {
        await assertAdmin(ctx);
        return await ctx.db
            .query("bookings")
            .withIndex("by_user", (q: any) => q.eq("userId", userId))
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
        paymentId: v.optional(v.string()),
        orderId: v.optional(v.string()),
        signature: v.optional(v.string()),
    },
    handler: async (ctx: any, args: any) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError(ERRORS.UNAUTHENTICATED);
        }

        // Server-side amount validation — reject tampered amounts
        if (
            typeof args.amount !== "number" ||
            args.amount < MIN_BOOKING_AMOUNT ||
            args.amount > MAX_BOOKING_AMOUNT
        ) {
            throw new ConvexError("Invalid booking amount");
        }

        // Get user to check wallet balance if paying with wallet
        const user = await ctx.db.get(userId);

        // Handle payment logic
        let paymentStatus = "pending";

        if (typeof args.paymentMethod === "string" && args.paymentMethod === "wallet") {
            if (!user || !user.walletBalance || user.walletBalance < args.amount) {
                throw new ConvexError(ERRORS.INSUFFICIENT_WALLET_BALANCE);
            }
            // Deduct from wallet
            await ctx.db.patch(user._id, {
                walletBalance: (user.walletBalance || 0) - args.amount,
                updatedAt: Date.now(),
            });
            paymentStatus = "paid";
        } else if (["upi", "card", "netbanking"].includes(args.paymentMethod as string)) {
            if (args.paymentId && args.orderId && args.signature) {
                const secret = process.env.RAZORPAY_KEY_SECRET;
                if (!secret) throw new ConvexError("Payment configuration error");

                const isValid = await verifyRazorpaySignature(
                    args.orderId,
                    args.paymentId,
                    args.signature,
                    secret
                );

                if (!isValid) {
                    throw new ConvexError("Payment verification failed. Please try again.");
                }

                // Replay attack prevention: check if paymentId already used
                const existing = await ctx.db
                    .query("bookings")
                    .withIndex("by_payment_id", (q: any) => q.eq("paymentId", args.paymentId))
                    .first();
                if (existing) throw new ConvexError("This payment has already been processed.");

                paymentStatus = "paid";
            } else {
                throw new ConvexError("Online payment details are missing.");
            }
        }

        const bookingId = await ctx.db.insert("bookings", {
            userId: userId,
            serviceName: args.serviceName,
            date: args.date,
            time: args.time,
            amount: args.amount,
            address: args.address,
            tankSize: args.tankSize,
            tankType: args.tankType,
            status: "pending",
            paymentStatus: paymentStatus,
            paymentId: args.paymentId,
            orderId: args.orderId,
            signature: args.signature,
            scheduledAt: args.date,
        });

        return bookingId;
    },
});

// Update booking status — enforces admin role
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
    handler: async (ctx: any, args: any) => {
        await assertAdmin(ctx);
        await ctx.db.patch(args.id, { status: args.status });
    },
});

// Cancel booking (user can cancel their own booking)
export const cancel = mutation({
    args: {
        id: v.id("bookings"),
    },
    handler: async (ctx: any, args: any) => {
        const userId = await assertAuth(ctx);

        const booking = await ctx.db.get(args.id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        if (booking.userId !== userId) {
            throw new Error("Unauthorized to cancel this booking");
        }

        if (booking.status === "completed" || booking.status === "in-progress") {
            throw new Error("Cannot cancel booking in progress or completed");
        }

        // If paid via wallet, refund the amount
        if (booking.paymentStatus === "paid") {
            const user = await ctx.db.get(userId);

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

// Get booking by ID — requires auth and ownership or admin role
export const getById = query({
    args: { id: v.id("bookings") },
    handler: async (ctx: any, args: any) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError(ERRORS.UNAUTHENTICATED);

        const booking = await ctx.db.get(args.id);
        if (!booking) return null;

        // Allow access only to the booking owner or an admin
        if (booking.userId === userId) return booking;

        const user = await ctx.db.get(userId);
        if (user?.role === "admin") return booking;

        throw new ConvexError(ERRORS.UNAUTHORIZED);
    },
});

export const reschedule = mutation({
    args: {
        id: v.id("bookings"),
        date: v.number(),
        time: v.string(),
    },
    handler: async (ctx: any, args: any) => {
        const userId = await assertAuth(ctx);

        const booking = await ctx.db.get(args.id);
        if (!booking) {
            throw new ConvexError("Booking not found");
        }

        if (booking.userId !== userId) {
            throw new ConvexError("Unauthorized to reschedule this booking");
        }

        if (booking.status === "completed" || booking.status === "cancelled") {
            throw new ConvexError(`Cannot reschedule a booking that is ${booking.status}`);
        }

        // 1. Enforce 4-hour window gate
        function getSlotStartHour(timeSlot: string): number {
            const slot = timeSlot.toLowerCase();
            if (slot.includes("morning") || slot.includes("8")) return 8;
            if (slot.includes("noon") || slot.includes("12")) return 12;
            if (slot.includes("evening") || slot.includes("4") || slot.includes("16")) return 16;
            return 9;
        }

        const bookingStartTime = booking.date + getSlotStartHour(booking.time) * 60 * 60 * 1000;
        const now = Date.now();
        if (bookingStartTime > now && bookingStartTime - now < 4 * 60 * 60 * 1000) {
            throw new ConvexError("Cannot reschedule bookings within 4 hours of the scheduled time.");
        }

        // 2. Maximum limit of 2 reschedules
        const currentCount = booking.rescheduleCount || 0;
        if (currentCount >= 2) {
            throw new ConvexError("This booking has already been rescheduled the maximum number of times (2).");
        }

        // 3. Capacity validation
        const dateStr = new Date(args.date).toISOString().split("T")[0];
        const serviceType = booking.serviceName;

        let slot = await ctx.db
            .query("slots")
            .withIndex("by_date_service", (q: any) => q.eq("date", dateStr).eq("serviceType", serviceType))
            .filter((q: any) => q.eq(q.field("time"), args.time))
            .first();

        let newSlotId = booking.slotId;

        if (!slot) {
            newSlotId = await ctx.db.insert("slots", {
                date: dateStr,
                serviceType: serviceType,
                time: args.time,
                booked: 1,
                capacity: 5,
            });
        } else {
            if (slot.booked >= slot.capacity) {
                throw new ConvexError("The selected time slot is fully booked. Please choose another time.");
            }
            await ctx.db.patch(slot._id, {
                booked: slot.booked + 1,
            });
            newSlotId = slot._id;
        }

        // Decrement old slot booked count
        if (booking.slotId) {
            const oldSlot = await ctx.db.get(booking.slotId);
            if (oldSlot) {
                await ctx.db.patch(oldSlot._id, {
                    booked: Math.max(0, oldSlot.booked - 1),
                });
            }
        }

        // 4. Update the booking
        await ctx.db.patch(args.id, {
            date: args.date,
            time: args.time,
            rescheduleCount: currentCount + 1,
            slotId: newSlotId,
            status: "rescheduled",
            updatedAt: Date.now(),
        });

        return true;
    },
});
