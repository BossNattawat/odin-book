import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from "@/lib/client";

export async function POST(req: Response) {
  try {
    const { displayName, username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username already exists!" }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        displayName: displayName,
        username: username,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created", user: { id: user.id } }, { status: 201 });
  } catch (err) {
    console.error("Error in signup route:", err);
    return NextResponse.json({ error: "User couldn't be created!" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}