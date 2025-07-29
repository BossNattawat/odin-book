import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if(!username) {
        return NextResponse.json({ error: "No result!" }, { status: 400 })
    }

    const users = await prisma.user.findMany({
        where: {
            username: {
                startsWith: username,
                mode: 'insensitive',
            }
        }
    })

    return NextResponse.json({ users: users }, { status: 200 })
}