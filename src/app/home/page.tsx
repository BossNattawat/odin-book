"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";

const posts = [
  {
    user: {
      displayName: "Onion",
      username: "onion8041"
    },
    text: "Hello world!"
  },
  {
    user: {
      displayName: "Onion",
      username: "onion8041"
    },
    text: "Hello world!"
  },
  {
    user: {
      displayName: "Onion",
      username: "onion8041"
    },
    text: "Hello world!"
  },
  {
    user: {
      displayName: "Onion",
      username: "onion8041"
    },
    text: "Hello world!"
  },
  {
    user: {
      displayName: "Onion",
      username: "onion8041"
    },
    text: "Hello world!"
  },
  {
    user: {
      displayName: "Onion",
      username: "onion8041"
    },
    text: "Hello world!"
  },
  {
    user: {
      displayName: "Onion",
      username: "onion8041"
    },
    text: "Hello world!"
  },
  {
    user: {
      displayName: "Onion",
      username: "onion8041"
    },
    text: "Hello world!"
  },
]

export default function Home() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  return (
    <div className="h-screen py-3 w-[38rem] flex flex-col overflow-y-scroll">
      <section className="flex flex-col mt-5 gap-y-3 border-b-[1px] border-slate-600 py-3 px-8">
        <div className="flex flex-row gap-2 items-start">
          <img src="/avatar.png" alt="profile" width={50} className="rounded-full" />
          <textarea placeholder="What's happening?" className="textarea textarea-xl text-xl w-full" />
        </div>
        <button className="btn btn-primary rounded-xl text-lg self-end">Post</button>
      </section>
      <section>
        {posts.map((post, index) => (
          <div key={index} className="flex flex-col gap-y-3 border-b-[1px] border-slate-600 py-3 px-8">
            <div className="flex gap-3 items-center">
                <img src="/avatar.png" alt="profile" width={35} className="rounded-full" />
                <div className="flex gap-x-1">
                    <p className="font-semibold">{post.user.displayName}</p>
                    <p className="text-gray-400">@{post.user.username}</p>
                </div>
            </div>
            <div className="">
              <p className="text-lg">{post.text}</p>
            </div>
            <div className="flex">
              <ul className="flex w-full gap-15">
                <li className="flex items-center gap-1 cursor-pointer">
                  <MessageCircle size={18}/> 2
                </li>
                <li className="flex items-center gap-1 cursor-pointer">
                  <Heart size={18}/> 8
                </li>
              </ul>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
