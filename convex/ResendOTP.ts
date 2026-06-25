import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15,
  async generateVerificationToken() {
    const random: RandomReader = { read(bytes) { crypto.getRandomValues(bytes); } };
    return generateRandomString(random, "0123456789", 6);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "FalkonCare <onboarding@resend.dev>",
      to: [email],
      subject: "Your FalkonCare sign-in code",
      text: `Your verification code is: ${token}\n\nValid for 15 minutes. Do not share this code.`,
    });
    if (error) throw new Error(JSON.stringify(error));
  },
});
