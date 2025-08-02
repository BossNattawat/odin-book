import prisma from "@/lib/client";
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { username: string } }) {
    try {
        const { username } = await params

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }

        const posts = await prisma.post.findMany({
            where: {
                author: {
                    username: username,
                },
            },
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
        })

        return NextResponse.json({ posts: posts }, { status: 200 })
    }
    catch {
        return NextResponse.json({ error: "Failed to get user posts" }, { status: 500 });
    }
}