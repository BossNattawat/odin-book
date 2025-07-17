"use client";

import { useSession } from "next-auth/react";
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

  if(status !== "loading") {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
          <span className="loading loading-ring loading-xl"></span>
      </div>
    )
  }
}
