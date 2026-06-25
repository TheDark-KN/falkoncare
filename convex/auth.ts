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

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        if (params.flow === "signUp") {
          const { error, data } = ProfileSchema.safeParse({
            name: params.name,
            phone: params.phone,
            dob: params.dob,
          });
          if (error) {
            throw new ConvexError(error.flatten().fieldErrors);
          }
          return {
            email: params.email as string,
            name: data.name,
            phone: data.phone,
            dob: data.dob,
            role: "customer",
            profileComplete: true,
          };
        }
        return { email: params.email as string };
      },
    }),
    ResendOTP,
  ],
});
