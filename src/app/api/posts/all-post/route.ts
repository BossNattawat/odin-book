/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {

        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        username: true,
                        displayName: true,
                        profilePic: true
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ posts: posts }, { status: 200 })
    }
    catch {
        return NextResponse.json({ error: "Failed to get posts" }, { status: 500 });
    }
}