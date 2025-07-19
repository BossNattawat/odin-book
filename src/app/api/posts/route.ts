/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/client";
import { NextResponse } from "next/server";

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
