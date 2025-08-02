"use client";

import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import Posts from "../components/Posts";

interface Author {
  username: string;
  displayName: string;
  profilePic: string;
}

interface Post {
  id: string;
  author: Author;
  authorId: string;
  content: string;
  commentCount: number;
  likeCount: number;
  createdAt: string;
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
            <Image
              src={session?.user.profilePic || "/avatar.png"}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
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
        {posts && (
          <Posts posts={posts}/>
        )}
      </section>
    </div>
  );
}
