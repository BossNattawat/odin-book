"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
    else {
      router.push("/home")
    }
  }, [session, status, router]);

  return (
    <div>
      <h1>Hello World!</h1>
      {session && (
        <div>
          <h1>{session.user?.displayName}</h1>
          <h1>{session.user?.username}</h1>
          <button className="btn btn-soft btn-info" onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
}
