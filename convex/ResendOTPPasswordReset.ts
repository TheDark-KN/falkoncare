import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";

export const ResendOTPPasswordReset = Email({
  id: "resend-otp-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15,
  async generateVerificationToken() {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    const code = (values[0] % 900000) + 100000;
    return code.toString();
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const from = process.env.NODE_ENV === "production" && process.env.RESEND_FROM_EMAIL
      ? `FalkonCare <${process.env.RESEND_FROM_EMAIL}>`
      : "FalkonCare <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Reset your FalkonCare password",
      text: `Your password reset code is: ${token}\n\nThis code expires in 15 minutes.\n\nIf you didn't request this, ignore this email.`,
    });
    if (error) throw new Error(JSON.stringify(error));
  },
});
