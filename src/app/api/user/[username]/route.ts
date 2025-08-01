import prisma from "@/lib/client";
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { username: string } }) {
    try {
        const { username } = await params

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }


        const userInfo = await prisma.user.findUnique({
            where: {
                username: username
            },
            include: {
                followers: {
                    select: {
                        follower: true, // Get the follower user details (can choose what fields to select)
                    },
                },
                following: {
                    select: {
                        following: true, // Get the following user details (can choose what fields to select)
                    },
                },
            }
        })

        return NextResponse.json({ user: userInfo }, { status: 200 })
    }
    catch {
        return NextResponse.json({ error: "Failed to get user info" }, { status: 500 });
    }
}