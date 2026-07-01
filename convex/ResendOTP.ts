import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";

export const ResendOTP = Email({
  id: "resend-otp",
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
    const from = process.env.RESEND_FROM_EMAIL
      ? `FalkonCare <${process.env.RESEND_FROM_EMAIL}>`
      : "FalkonCare <noreply@mail.falkoncare.com>";
    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Your FalkonCare sign-in code",
      text: `Your verification code is: ${token}\n\nValid for 15 minutes. Do not share this code.`,
    });
    if (error) throw new Error(JSON.stringify(error));
  },
});
