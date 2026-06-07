import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// TEMPORARY admin-setup endpoint.
// After visiting /api/make-admin?secret=falkon2024 while signed in,
// your Clerk publicMetadata.role will be set to "admin".
// DELETE this file once you have confirmed admin access works.

const SETUP_SECRET = "falkon2024";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "You must be signed in first. Visit /sign-in then come back." },
      { status: 401 }
    );
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role: "admin" },
  });

  return NextResponse.json({
    success: true,
    message: `✅ User ${userId} has been granted admin role! Now sign out and sign back in, then visit /admin`,
    next_steps: [
      "1. Sign out of falkoncare.com",
      "2. Sign back in",
      "3. Visit https://falkoncare.com/admin/surveys",
    ],
  });
}
