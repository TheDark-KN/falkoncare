import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: authTables.users
    .index("email", ["email"])
    .extend({
      phone: v.optional(v.string()),
      dob: v.optional(v.string()),
      role: v.optional(v.union(v.literal("admin"), v.literal("user"), v.literal("staff"), v.literal("customer"))),
      profileComplete: v.optional(v.boolean()),
      walletBalance: v.optional(v.number()),
      address: v.optional(v.string()),
      processedPaymentIds: v.optional(v.array(v.string())),
      imageUrl: v.optional(v.string()),
    }),

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
      v.literal("cancelled")
    ),
    address: v.string(),
    tankSize: v.optional(v.string()),
    tankType: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),
});