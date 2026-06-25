import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { ConvexHttpClient } from "convex/browser";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";

// Simple in-memory rate limiter (resets per serverless invocation; use Redis/Upstash for production)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 order creations per minute per user

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(userId);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

// [FIXED C8] POST /api/razorpay — now requires authentication, validates input, and rate-limits
export async function POST(req: Request) {
  try {
    // [FIXED C8 - Auth] Require authenticated session
    const token = await convexAuthNextjsToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(token);

    const user = await convex.query(api.users.current);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user._id;

    // [FIXED M4] Basic rate limiting per user
    if (isRateLimited(userId)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { amount } = body;

    // [FIXED C8 - Validation] Strict type and range check on amount
    if (
      amount === undefined ||
      amount === null ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 100000 // Max ₹1,00,000 per top-up
    ) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a number between 1 and 100000." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const options = {
      amount: Math.round(amount) * 100, // Convert to paise, use integer
      currency: "INR",
      receipt: `receipt_${userId.slice(-8)}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Return only necessary fields — not the full Razorpay order object
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    // [FIXED M7] Do not leak internal error details to client
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
