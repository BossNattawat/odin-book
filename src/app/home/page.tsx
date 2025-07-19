"use client";

import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface Author {
  username: string
  displayName: string
}

interface Post {
  id: string
  author: Author
  authorId: string
  content: string
  commentCount: number
  likeCount: number
  createdAt: string
}

export default function Home() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [postContent, setPostContent] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      axios
        .get("/api/posts/all-post")
        .then((res) => {
          setPosts(res.data.posts);
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [session]);

  async function handleCreatePost(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!postContent.trim()) {
      toast.error("Content is required");
    }

    try {
      const data = {
        username: session?.user.username,
        content: postContent,
      };

      await axios.post("/api/posts", data);
      toast.success("Post created successfully");
    } catch {
      toast.error("An error occured! Please try again later");
    }
  }

  return (
    <div className="h-screen py-3 w-[38rem] flex flex-col overflow-y-scroll">
      <section className="flex flex-col mt-5 gap-y-3 border-b-[1px] border-slate-600 py-3 px-8">
        <form
          className="flex flex-col mt-5 gap-y-3"
          onSubmit={handleCreatePost}
        >
          <div className="flex flex-row gap-2 items-start">
            <img
              src="/avatar.png"
              alt="profile"
              width={50}
              className="rounded-full"
            />
            <textarea
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's happening?"
              className="textarea textarea-xl text-xl w-full"
            />
          </div>
          <button
            disabled={postContent.trim().length === 0}
            className="btn btn-primary rounded-xl text-lg self-end"
          >
            Post
          </button>
        </form>
      </section>
      <section>
        {posts ? (
          <>
            {posts.map((post, index) => (
              <div
                key={index}
                className="flex flex-col gap-y-3 border-b-[1px] border-slate-600 py-3 px-8"
              >
                <div className="flex gap-3 items-center">
                  <img
                    src="/avatar.png"
                    alt="profile"
                    width={35}
                    className="rounded-full"
                  />
                  <div className="flex flex-col gap-x-1">
                    <p className="font-semibold">{post.author.displayName}</p>
                    <p className="text-gray-400">@{post.author.username}</p>
                  </div>
                </div>
                <div className="">
                  <p className="text-lg">{post.content}</p>
                </div>
                <div className="flex">
                  <ul className="flex w-full gap-15">
                    <li className="flex items-center gap-1 cursor-pointer">
                      <MessageCircle size={18} /> {post.commentCount}
                    </li>
                    <li className="flex items-center gap-1 cursor-pointer">
                      <Heart size={18} /> {post.likeCount}
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div></div>
        )}
      </section>
    </div>
  );
}
