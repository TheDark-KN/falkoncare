import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ResendOTP } from "./ResendOTP";
import { ConvexError } from "convex/values";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  dob: z.string().refine(val => {
    const age = (Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }, "Must be at least 18 years old"),
});

// Clean up environment variables at runtime to prevent base64/atob or JSON parsing errors.
// This is robust against copy-paste mistakes (like literal \n sequences or outer quotes).
if (process.env.JWT_PRIVATE_KEY) {
  process.env.JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");
}
if (process.env.JWKS) {
  let jwks = process.env.JWKS.trim();
  if (jwks.startsWith("'") && jwks.endsWith("'")) {
    jwks = jwks.slice(1, -1);
  } else if (jwks.startsWith('"') && jwks.endsWith('"')) {
    jwks = jwks.slice(1, -1);
  }
  process.env.JWKS = jwks;
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const name = typeof params.name === "string" ? params.name : undefined;
        const phone = typeof params.phone === "string" ? params.phone : undefined;
        const dob = typeof params.dob === "string" ? params.dob : undefined;

        return {
          email: params.email as string,
          ...(name !== undefined && { name }),
          ...(phone !== undefined && { phone }),
          ...(dob !== undefined && { dob }),
          role: "customer" as const,
          profileComplete: true as const,
        };
      },
    }),
    ResendOTP,
  ],
});
