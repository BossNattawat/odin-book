import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import prisma from "@/lib/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from 'bcrypt';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" }
            },

            async authorize(credentials) {

                if (!credentials) {
                    return null
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username }
                    })

                    if (!user) {
                        throw new Error("Invalid username or password");
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordMatch) {
                        throw new Error("Invalid username or password");
                    }

                    const data = {
                        id: user.id,
                        username: user.username,
                        displayName: user.displayName
                    }

                    return data
                }
                catch (err) {
                    console.error("Error in authorize function:", (err as Error).message);
                    throw new Error("Invalid username or password");
                }
            }
        })
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.displayName = token.displayName;
            }
            return session;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.displayName = user.displayName;
            }
            return token;
        },

    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }