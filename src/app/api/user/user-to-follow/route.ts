import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

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

  const followedUserIds = currentUser.following.map(f => f.followingId);

  const suggestedUsers = await prisma.user.findMany({
    take: 5,
    where: {
      id: {
        notIn: [...followedUserIds, currentUser.id]
      }
    },
    select: {
      username: true,
      displayName: true,
      profilePic: true
    }
  });

  return NextResponse.json({ users: suggestedUsers }, { status: 200 });
}
