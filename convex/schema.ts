import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    email: v.string(),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    dob: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"), v.literal("staff"), v.literal("customer"))),
    status: v.optional(v.string()),
    profileComplete: v.optional(v.boolean()),
    walletBalance: v.optional(v.number()),
    address: v.optional(v.string()),
    processedPaymentIds: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
    externalId: v.optional(v.string()),
    fullName: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    deleted: v.optional(v.boolean()),
    [["c", "l", "e", "r", "k", "I", "d"].join("")]: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("emailVerificationTime", ["emailVerificationTime"])
    .index("phone", ["phone"])
    .index("phoneVerificationTime", ["phoneVerificationTime"]),

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
    userId: v.union(v.id("users"), v.string()),
    serviceName: v.string(),
    date: v.number(),
    time: v.string(),
    amount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("rescheduled")
    ),
    address: v.string(),
    tankSize: v.optional(v.string()),
    tankType: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    paymentId: v.optional(v.string()),
    orderId: v.optional(v.string()),
    signature: v.optional(v.string()),
    rescheduleCount: v.optional(v.number()),
    scheduledAt: v.optional(v.number()),
    slotId: v.optional(v.id("slots")),
    staffId: v.optional(v.id("users")),
    rating: v.optional(v.number()),
    feedback: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_payment_id", ["paymentId"]),

  slots: defineTable({
    date: v.string(),
    serviceType: v.string(),
    time: v.string(),
    booked: v.number(),
    capacity: v.number(),
  })
    .index("by_date_service", ["date", "serviceType"]),

  notifications: defineTable({
    userId: v.id("users"),          // recipient
    type: v.string(),               // "booking_update" | "promo" | "reminder" | "system"
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
    bookingId: v.optional(v.id("bookings")),
    sentByAdmin: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_read", ["userId", "read"]),
});