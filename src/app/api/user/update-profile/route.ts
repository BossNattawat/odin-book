/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/client"
import cloudinary from "@/lib/cloudinary"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    
    try {
        const { profilePic, username } = await req.json()

        const user = prisma.user.findUnique({
            where: {
                username: username
            },
            omit: {
                password: true
            }
        })

        if(!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 })
        }

        if(!profilePic) {
            return NextResponse.json({error: "Profile picture is required" }, { status: 400 })
        }
    
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await prisma.user.update({
            where: {
                username: username
            },
            data: {
                profilePic: uploadResponse.secure_url
            }
        })

        return NextResponse.json({ message: "Profile picture updated", updatedUser }, { status: 200 })
    }
    catch (error: any){
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }

}