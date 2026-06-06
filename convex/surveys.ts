import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Falkon Survey — Convex Backend
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Submit a completed survey form
export const submitSurvey = mutation({
  args: {
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
    customerDecision: v.string(),
    servicesRequired: v.array(v.string()),
    preferredServiceDate: v.string(),
    leadPriority: v.string(),
    remarks: v.string(),
    declarationAccepted: v.boolean(),
    signatureName: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("UNAUTHENTICATED");
    }

    // Validate mobile number server-side
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(args.mobileNumber)) {
      throw new ConvexError("Invalid mobile number format");
    }

    // Validate declaration is accepted
    if (!args.declarationAccepted) {
      throw new ConvexError("Declaration must be accepted");
    }

    const surveyId = await ctx.db.insert("surveys", {
      ...args,
      submittedBy: identity.subject,
      createdAt: Date.now(),
    });

    return surveyId;
  },
});

// Get all surveys (admin-only)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("UNAUTHENTICATED");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      throw new ConvexError("UNAUTHORIZED");
    }

    return await ctx.db.query("surveys").order("desc").collect();
  },
});

// Get surveys by surveyor
export const getBySurveyor = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("surveys")
      .withIndex("by_surveyor", (q) => q.eq("surveyorId", identity.subject))
      .order("desc")
      .collect();
  },
});

// Get society/area list for the dropdown
export const getSocieties = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db.query("societies").collect();
  },
});
