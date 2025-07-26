
/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const postID = searchParams.get("postID");

    if (!postID) {
      return NextResponse.json({ error: "postID is required" }, { status: 400 });
    }

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postID },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found!" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const { username, content }: { username: string; content: string } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        content,
        authorId: user.id,
      },
    });

    return NextResponse.json({ message: "Post created successfully", post }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
