/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Comments from "@/app/components/Comments"

interface Author {
  username: string;
  displayName: string;
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

function PostPage() {
  const { postID, username } = useParams<{
    postID: string;
    username: string;
  }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (!username || !postID) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/posts", {
          params: {
            username,
            postID,
          },
        });

        const fetchedPost: Post = res.data.post;
        setPost(fetchedPost);
        setLikeCount(fetchedPost.likeCount);

        // Optional: fetch like status for current user
        if (session?.user.username) {
          const likeRes = await axios.get(`/api/posts/is-liked/`, {
            params: {
              username: session.user.username,
              postID: postID,
            },
          });
          setLiked(likeRes.data.liked);
        } else {
          setLiked(false);
        }
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();

    // Fetch comments (replies) for the post
    axios
      .get(`/api/replies/`, {
        params: {
          postID,
        },
      })
      .then((res) => {
        setComments(res.data.replies || []);
      })
      .catch(() => {
        setComments([]);
      });

  }, [username, postID, session?.user.username]);

  const likePost = async (postId: string) => {
    try {
      await axios.post("/api/posts/like", {
        username: session?.user.username,
        postId,
      });

      // Optimistically update UI
      setLiked((prev) => !prev);
      setLikeCount((prev) => prev + (liked ? -1 : 1));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  async function handleCreateComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!commentContent.trim()) {
      toast.error("Content is required");
    }

    try {
      const data = {
        username: session?.user.username,
        content: commentContent,
        postId: postID,
      };

      await axios.post("/api/replies", data);
      toast.success("Reply created successfully");
    } catch {
      toast.error("An error occured! Please try again later");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-[38rem] flex justify-center items-center">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen w-[38rem] flex justify-center items-center">
        <h1>{error || "Post not found."}</h1>
      </div>
    );
  }

  return (
    <div className="h-screen py-3 w-[38rem] flex flex-col overflow-y-scroll">
      <section className="w-full p-3">
        <button className="text-2xl font-bold flex gap-x-5">
          <ArrowLeft
            onClick={() => router.back()}
            size={30}
            className="cursor-pointer"
          />
          Post
        </button>
      </section>

      <section>
        <div className="flex flex-col gap-y-3 border-b-[1px] border-slate-600 py-3 px-8">
          <div className="flex gap-3 items-center">
            <Image
              src="/avatar.png"
              alt="profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col gap-x-1">
              <Link
                href={`/profile/${post.author.username}`}
                className="font-semibold"
              >
                {post.author.displayName}
              </Link>
              <p className="text-gray-400">@{post.author.username}</p>
            </div>
          </div>

          <Link href={`/profile/${post.author.username}/post/${post.id}`}>
            <p className="text-lg">{post.content}</p>
          </Link>

          <div className="flex">
            <ul className="flex w-full gap-10">
              <li className="flex items-center gap-1 cursor-pointer">
                <MessageCircle size={18} /> {post.commentCount}
              </li>
              <li
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => likePost(post.id)}
              >
                <Heart
                  size={18}
                  className={liked ? "text-red-500 fill-red-500" : ""}
                />
                {likeCount}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="flex flex-col mt-5 gap-y-3 border-b-[1px] border-slate-600 py-3 px-8">
        <form
          className="flex flex-col md:flex-row mb-5 gap-3 justify-between"
          onSubmit={handleCreateComment}
        >
          <div className="flex flex-row gap-2 items-start w-full">
            <Image
              src={ session?.user.profilePic || "/avatar.png" }
              alt="profile"
              width={40}
              height={40}
              className="rounded-full hidden md:flex object-cover"
            />
            <textarea
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Post your reply..."
              className="textarea textarea-xl text-xl w-full"
            />
          </div>
          <button
            disabled={commentContent.trim().length === 0}
            className="btn btn-primary rounded-xl text-lg"
          >
            Post
          </button>
        </form>
      </section>
      <section>
        <Comments comment={comments}/>
      </section>
    </div>
  );
}

export default PostPage;
