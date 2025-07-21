/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { username, postId }: { username: string; postId: string } = await req.json();

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const alreadyLiked = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId,
                },
            },
        });

        if (alreadyLiked) {
            // Unlike: remove like and decrement likeCount
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId: user.id,
                        postId,
                    },
                },
            });
            await prisma.post.update({
                where: { id: postId },
                data: {
                    likeCount: {
                        decrement: 1,
                    },
                },
            });
            return NextResponse.json({ message: "Post unliked successfully" }, { status: 201 });
        }

        // Like: create like and increment likeCount
        await prisma.like.create({
            data: {
                userId: user.id,
                postId,
            },
        });

        await prisma.post.update({
            where: { id: postId },
            data: {
                likeCount: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json({ message: "Post liked successfully" }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all likes by the user, including the liked post and author
    const likes = await prisma.like.findMany({
      where: { userId: user.id },
      include: {
        post: {
          include: {
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

    // Extract only post data
    const likedPosts = likes.map((like) => like.post);

    return NextResponse.json({ likedPosts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}