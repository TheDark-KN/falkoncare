import { z } from "zod";

const envSchema = z.object({
  CONVEX_URL: z.string().url("CONVEX_URL must be a valid URL").optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1, "RAZORPAY_KEY_SECRET is required for payment verification"),
  AUTH_RESEND_KEY: z.string().startsWith("re_", "AUTH_RESEND_KEY must start with re_"),
  SITE_URL: z.string().url("SITE_URL must be a valid URL"),
  JWT_PRIVATE_KEY: z.string().min(100, "JWT_PRIVATE_KEY appears to be missing or too short"),
});

export function validateEnv() {
  // In Convex, process.env is populated on the backend deployment.
  // During local build/type-check, some env vars might be empty in the local shell.
  // We can skip validation if we are in a non-Convex-deployment CLI run (optional safety gate).
  if (typeof window !== "undefined" || (!process.env.CONVEX_DEPLOYMENT && !process.env.RAZORPAY_KEY_SECRET)) {
    return {} as any;
  }

  const result = envSchema.safeParse({
    CONVEX_URL: process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
    SITE_URL: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  });

  if (!result.success) {
    const errors = result.error.issues.map(i => `  ✗ ${i.path[0]}: ${i.message}`).join("\n");
    throw new Error(`\n\nMissing or invalid environment variables:\n${errors}\n\nCheck your Convex Dashboard > Settings > Environment Variables.\n`);
  }
  return result.data;
}

export const env = validateEnv();
