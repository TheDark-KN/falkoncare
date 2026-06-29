import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const sendNotificationEmail = internalAction({
  args: { to: v.string(), name: v.string(), title: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    const from = process.env.NODE_ENV === "production" && process.env.RESEND_FROM_EMAIL
      ? `FalkonCare <${process.env.RESEND_FROM_EMAIL}>`
      : "FalkonCare <onboarding@resend.dev>";
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.AUTH_RESEND_KEY);
    await resend.emails.send({
      from,
      to: [args.to],
      subject: args.title,
      text: `Hi ${args.name},\n\n${args.message}\n\n— The FalkonCare Team`,
    });
  },
});
