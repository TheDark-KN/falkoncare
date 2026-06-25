import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";

const SETUP_SECRET = "falkon2024";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = await convexAuthNextjsToken();
  if (!token) {
    return NextResponse.json(
      { error: "You must be signed in first. Visit /signin then come back." },
      { status: 401 }
    );
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  convex.setAuth(token);

  const user = await convex.query(api.users.current);
  if (!user) {
    return NextResponse.json(
      { error: "User not found or unauthenticated." },
      { status: 401 }
    );
  }

  await convex.mutation(api.users.makeUserAdmin, {
    userId: user._id,
    secret: SETUP_SECRET,
  });

  return NextResponse.json({
    success: true,
    message: `✅ User ${user._id} has been granted admin role in Convex!`,
    next_steps: [
      "1. Go to /dashboard",
      "2. Visit /admin to access the inspection portal",
    ],
  });
}
