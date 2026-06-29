import { v, ConvexError } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Helper function to check admin role
async function checkAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError("Not authenticated");
  }
  const user = await ctx.db.get(userId);
  if (!user || user.role !== "admin") {
    throw new ConvexError("Admin access required");
  }
  return userId;
}

// Admin: get all bookings sorted by createdAt desc
export const getAllBookings = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);

    const bookings = await ctx.db
      .query("bookings")
      .order("desc")
      .collect();

    // Join user info
    const bookingsWithUser = await Promise.all(
      bookings.map(async (booking) => {
        let user: any = null;
        try {
          if (booking.userId) {
            user = await ctx.db.get(booking.userId as any);
          }
        } catch (e) {
          // ignore invalid IDs
        }

        let staff: any = null;
        try {
          if (booking.staffId) {
            const st = await ctx.db.get(booking.staffId);
            if (st) {
              staff = {
                id: st._id,
                name: st.name ?? st.fullName ?? "Staff Member",
              };
            }
          }
        } catch (e) {
          // ignore
        }

        return {
          ...booking,
          user: user
            ? {
                name: user.name ?? user.fullName ?? "Customer",
                email: user.email,
                phone: user.phone ?? user.phoneNumber ?? "-",
              }
            : {
                name: "Unknown Customer",
                email: "-",
                phone: "-",
              },
          staff,
        };
      })
    );

    return bookingsWithUser;
  },
});

// Admin: get all users with booking counts
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);

    const users = await ctx.db
      .query("users")
      .collect();

    const activeUsers = users.filter((u) => !u.deleted);

    const usersWithBookings = await Promise.all(
      activeUsers.map(async (user) => {
        const userBookings = await ctx.db
          .query("bookings")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        return {
          _id: user._id,
          _creationTime: user._creationTime,
          name: user.name ?? user.fullName ?? "Unnamed User",
          email: user.email,
          phone: user.phone ?? user.phoneNumber ?? "-",
          role: user.role ?? "customer",
          bookingCount: userBookings.length,
        };
      })
    );

    return usersWithBookings;
  },
});

// Admin: get dashboard statistics
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);

    const users = await ctx.db.query("users").collect();
    const activeUsers = users.filter((u) => !u.deleted);

    const bookings = await ctx.db.query("bookings").collect();

    // Total Revenue from completed bookings
    const completedBookings = bookings.filter((b) => b.status === "completed");
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.amount ?? 0), 0);

    // Bookings by Status
    const bookingsByStatus = {
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      "in-progress": bookings.filter((b) => b.status === "in-progress").length,
      completed: completedBookings.length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };

    // Bookings this week
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const bookingsThisWeek = bookings.filter((b) => b._creationTime >= oneWeekAgo).length;

    return {
      totalUsers: activeUsers.length,
      totalBookings: bookings.length,
      totalRevenue,
      bookingsByStatus,
      bookingsThisWeek,
    };
  },
});

// Admin: update booking status
export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new ConvexError("Booking not found");
    }

    await ctx.db.patch(args.bookingId, { status: args.status });

    // Insert in-app notification for the customer about status change
    await ctx.db.insert("notifications", {
      userId: booking.userId as any,
      type: "booking_update",
      title: `Booking Update`,
      message: `Your booking for ${booking.serviceName} has been updated to ${args.status}.`,
      read: false,
      createdAt: Date.now(),
      bookingId: args.bookingId,
    });

    return true;
  },
});

// Admin: soft delete user
export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(args.userId, { deleted: true });
    return true;
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("staff"), v.literal("customer")),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    await ctx.db.patch(args.userId, { role: args.role });
    return true;
  },
});

// Admin: send notification to one user
export const sendNotificationToUser = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    sendEmail: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    // Create in-app notification
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      read: false,
      createdAt: Date.now(),
      sentByAdmin: true,
    });

    // Send email notification if requested
    if (args.sendEmail) {
      const recipient: any = await ctx.db.get(args.userId);
      if (recipient?.email) {
        await ctx.scheduler.runAfter(0, internal.emails.sendNotificationEmail, {
          to: recipient.email as string,
          name: (recipient.name ?? recipient.fullName ?? "Customer") as string,
          title: args.title,
          message: args.message,
        });
      }
    }
    return true;
  },
});

// Admin: broadcast to ALL users
export const sendNotificationToAll = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    message: v.string(),
    sendEmail: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    const allUsers = await ctx.db.query("users").collect();
    const activeUsers = allUsers.filter((u) => !u.deleted);

    await Promise.all(
      activeUsers.map(async (user) => {
        await ctx.db.insert("notifications", {
          userId: user._id,
          type: args.type,
          title: args.title,
          message: args.message,
          read: false,
          createdAt: Date.now(),
          sentByAdmin: true,
        });

        if (args.sendEmail && user.email) {
          await ctx.scheduler.runAfter(0, internal.emails.sendNotificationEmail, {
            to: user.email as string,
            name: (user.name ?? user.fullName ?? "Customer") as string,
            title: args.title,
            message: args.message,
          });
        }
      })
    );
    return true;
  },
});

// Admin: add a new staff member
export const addStaff = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const normalizedEmail = args.email.trim().toLowerCase();

    // Check if email already registered
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (existing) {
      throw new ConvexError("Email already registered in the system");
    }

    const staffId = await ctx.db.insert("users", {
      name: args.name,
      fullName: args.name,
      email: normalizedEmail,
      phone: args.phone,
      role: "staff",
      status: "available", // default status
      walletBalance: 0,
      createdAt: Date.now(),
      profileComplete: true, // Auto-complete for admin created staff
    });

    return staffId;
  },
});

// Admin: update staff status
export const updateStaffStatus = mutation({
  args: {
    staffId: v.id("users"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    const user = await ctx.db.get(args.staffId);
    if (!user || user.role !== "staff") {
      throw new ConvexError("Staff member not found");
    }

    await ctx.db.patch(args.staffId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return true;
  },
});

// Admin: assign staff member to a booking
export const assignStaff = mutation({
  args: {
    bookingId: v.id("bookings"),
    staffId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new ConvexError("Booking not found");
    }

    const staff = await ctx.db.get(args.staffId);
    if (!staff || staff.role !== "staff") {
      throw new ConvexError("Staff member not found");
    }

    await ctx.db.patch(args.bookingId, {
      staffId: args.staffId,
      updatedAt: Date.now(),
    });

    // Notify staff member if needed (optional)
    await ctx.db.insert("notifications", {
      userId: args.staffId,
      type: "system",
      title: "New Job Assigned",
      message: `You have been assigned to cleaning job ${booking.serviceName} at ${booking.address} on ${new Date(booking.date).toLocaleDateString("en-IN")}.`,
      read: false,
      createdAt: Date.now(),
    });

    return true;
  },
});
