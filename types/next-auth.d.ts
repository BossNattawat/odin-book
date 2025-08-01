import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      displayName: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    displayName: string;
    profilePic: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
