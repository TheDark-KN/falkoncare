import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    surveys: defineTable({
        surveyorId: v.string(),
        surveyorName: v.string(),
        surveyDate: v.string(),
        societyArea: v.string(),
        gpsCoordinates: v.union(
            v.object({ lat: v.number(), lng: v.number() }),
            v.null()
        ),
        houseFlatNumber: v.string(),
        floor: v.string(),
        mobileNumber: v.string(),
        customerName: v.string(),
        emailId: v.string(),
        tankType: v.string(),
        tankMaterials: v.array(v.string()),
        otherMaterial: v.string(),
        totalTanks: v.string(),
        tankCapacity: v.string(),
        totalWaterStorage: v.number(),
        lastCleaning: v.string(),
        isDirty: v.union(v.boolean(), v.null()),
        isLidBroken: v.union(v.boolean(), v.null()),
        isDamaged: v.union(v.boolean(), v.null()),
        isMosquitoPresent: v.union(v.boolean(), v.null()),
        waterCondition: v.string(),
        photoCategories: v.array(v.string()),
        customerConsent: v.union(v.boolean(), v.null()),
        numberOfPhotos: v.number(),
        photoStorageIds: v.optional(v.array(v.string())),

        customerDecision: v.string(),
        servicesRequired: v.array(v.string()),
        preferredServiceDate: v.string(),
        leadPriority: v.string(),
        remarks: v.string(),
        declarationAccepted: v.boolean(),
        signatureName: v.string(),
        timestamp: v.number(),
        submittedBy: v.string(),
        createdAt: v.number(),
    })
        .index("by_surveyor", ["surveyorId"])
        .index("by_society", ["societyArea"])
        .index("by_date", ["surveyDate"]),

    societies: defineTable({
        name: v.string(),
        area: v.string(),
    })
        .index("by_name", ["name"]),

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
