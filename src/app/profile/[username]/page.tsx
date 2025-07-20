/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import Posts from "@/app/components/Posts";

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

function Profile() {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState<null | any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>();
  const [activeTab, setActiveTab] = useState<string>("Posts");

  // const tabs = [
  //   {
  //     id: "Posts",
  //     label: "Posts",
  //     content: <Posts posts={posts} />,
  //   },
  // ];

  useEffect(() => {
    setLoading(true);
    try {
      axios
        .get(`/api/user/${username}`)
        .then((res) => {
          setUserInfo(res.data.user);
        })
        .catch(() => {
          setError("Failed to fetch user data");
        });
      axios
        .get(`/api/posts/${username}`)
        .then((res) => {
          setPosts(res.data.posts);
        })
        .catch(() => {
          setError("Failed to fetch posts");
        });
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [username]);

  if (loading)
    return (
      <div className="min-h-screen w-[38rem] flex justify-center items-center">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen w-[38rem] flex justify-center items-center">
        <h1>{error}</h1>
      </div>
    );

  if (!userInfo && !loading) {
    return (
      <div className="min-h-screen w-[38rem] flex justify-center items-center">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="h-screen py-3 w-[38rem] flex flex-col overflow-y-scroll">
      <section className="flex flex-col gap-y-3 mb-8 px-8">
        <div>
          <h1 className="text-2xl font-semibold">{userInfo.displayName}</h1>
          <h3 className="text-gray-400">@{userInfo.username}</h3>
        </div>
        <p className="flex gap-2 items-center text-gray-400">
          <Calendar /> Joined {new Date(userInfo.createdAt).toDateString()}
        </p>
        <div className="flex gap-x-3">
          <p className="text-gray-400">
            <span className="font-bold text-base-content">
              {userInfo.following.length}
            </span>{" "}
            Following
          </p>
          <p className="text-gray-400">
            <span className="font-bold text-base-content">
              {userInfo.followers.length}
            </span>{" "}
            Follower
          </p>
        </div>
      </section>

      <section className="mb-5 px-8">
        <div className="flex gap-x-5">
          <button
            onClick={() => setActiveTab("Posts")}
            className={`text-lg text-gray-400 ${
              activeTab === "Posts"
                ? "border-b-2 border-slate-200"
                : "text-gray-100"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("Replies")}
            className={`text-lg text-gray-400 ${
              activeTab === "Replies"
                ? "border-b-2 border-slate-200"
                : "text-gray-100"
            }`}
          >
            Replies
          </button>
          <button
            onClick={() => setActiveTab("Likes")}
            className={`text-lg text-gray-400 ${
              activeTab === "Likes"
                ? "border-b-2 border-slate-200"
                : "text-gray-100"
            }`}
          >
            Likes
          </button>
        </div>
      </section>

      <section>
        {posts && (
          <Posts posts={posts}/>
        )}
      </section>
    </div>
  );
}

export default Profile;
