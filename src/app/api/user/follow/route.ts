/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function POST(req: Request) {
    try {
        const { followerUsername, followingUsername } = await req.json()

        const follower = await prisma.user.findUnique({
            where: {
                username: followerUsername
            }
        })

        const following = await prisma.user.findUnique({
            where: {
                username: followingUsername
            }
        })

        if (!follower || !following) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const alreadyFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: follower.id,
                    followingId: following.id,
                },
            },
        });

        if (alreadyFollowing) {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: follower.id,
                        followingId: following.id,
                    },
                },
            });

            return NextResponse.json({ message: "Unfollowed successfully", followed: false }, { status: 200 });
        }

        await prisma.follow.create({
            data: {
                followerId: follower.id,
                followingId: following.id,
            },
        });

        return NextResponse.json({ message: "Followed successfully", followed: true }, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const followerUsername = searchParams.get("followerUsername");
        const followingUsername = searchParams.get("followingUsername");

        if (!followerUsername || !followingUsername) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const follower = await prisma.user.findUnique({
            where: { username: followerUsername },
            omit: {
                password: true
            }
        });
        const following = await prisma.user.findUnique({
            where: { username: followingUsername },
            omit: {
                password: true
            }
        });

        if (!follower || !following) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: follower.id,
                    followingId: following.id,
                },
            },
        });

        return NextResponse.json({ isFollowing: !!follow }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}