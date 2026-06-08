import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Falkon Survey — Convex Backend
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Generate a secure upload URL for files
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("UNAUTHENTICATED");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

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
    photoStorageIds: v.optional(v.array(v.string())),
    customerDecision: v.string(),
    servicesRequired: v.array(v.string()),
    preferredServiceDate: v.string(),
    leadPriority: v.string(),
    remarks: v.string(),
    declarationAccepted: v.boolean(),
    signatureName: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // The Clerk → Convex JWT pipeline is not working.  The most common
      // causes are: (1) the Clerk "convex" JWT template is missing, or
      // (2) CLERK_JWT_ISSUER_DOMAIN on the Convex deployment does not
      // match the Clerk instance.  See `convex/auth.config.ts` for
      // setup notes.
      throw new ConvexError(
        "Sign-in expired or the Convex auth pipeline is mis-configured. " +
          "Please sign out and back in, and contact the team if the issue persists."
      );
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
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("UNAUTHENTICATED");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      throw new ConvexError("UNAUTHORIZED");
    }

    const surveys = await ctx.db.query("surveys").order("desc").collect();
    return await Promise.all(
      surveys.map(async (survey: any) => {
        let photoUrls: string[] = [];
        if (survey.photoStorageIds) {
          photoUrls = await Promise.all(
            survey.photoStorageIds.map((id: string) => ctx.storage.getUrl(id))
          );
        }
        return {
          ...survey,
          photoUrls: photoUrls.filter(Boolean),
        };
      })
    );
  },
});

// Get surveys by surveyor
export const getBySurveyor = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const surveys = await ctx.db
      .query("surveys")
      .withIndex("by_surveyor", (q: any) => q.eq("surveyorId", identity.subject))
      .order("desc")
      .collect();

    return await Promise.all(
      surveys.map(async (survey: any) => {
        let photoUrls: string[] = [];
        if (survey.photoStorageIds) {
          photoUrls = await Promise.all(
            survey.photoStorageIds.map((id: string) => ctx.storage.getUrl(id))
          );
        }
        return {
          ...survey,
          photoUrls: photoUrls.filter(Boolean),
        };
      })
    );
  },
});

// Get society/area list for the dropdown
export const getSocieties = query({
  args: {},
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db.query("societies").collect();
  },
});
