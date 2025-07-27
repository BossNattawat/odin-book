import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Find current user
  const currentUser = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      following: {
        select: {
          followingId: true
        }
      }
    }
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Query users not followed yet and not the current user
  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: {
        not: currentUser.id // Exclude followed users + self
      }
    },
    select: {
      username: true,
      displayName: true
    }
  });

  return NextResponse.json({ users: suggestedUsers }, { status: 200 });
}
