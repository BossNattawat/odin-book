/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import Posts from "@/app/components/Posts";
import Comments from "@/app/components/Comments";
import { useSession } from "next-auth/react";

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

interface Comment {
  id: string;
  author: Author;
  authorId: string;
  content: string;
  createdAt: string;
  post: Post
}

function Profile() {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState<null | any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>();
  const [replies, setReplies] = useState<Comment[]>(); // Add replies state
  const [likedPosts, setLikedPosts] = useState<Post[]>(); // Add liked posts state
  const [activeTab, setActiveTab] = useState<string>("Posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const { data: session, status } = useSession();

  // Function to check if current user is following profile user
  async function checkIsFollowing(
    profileUsername: string,
    currentUsername: string
  ) {
    try {
      const res = await axios.get("/api/user/follow", {
        params: {
          followerUsername: currentUsername,
          followingUsername: profileUsername,
        },
      });
      return res.data.isFollowing;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    setLoading(true);
    try {
      axios
        .get(`/api/user/${username}`)
        .then(async (res) => {
          setUserInfo(res.data.user);
          // Use API to check if following
          if (
            session?.user?.username &&
            session.user.username !== username &&
            username !== null
          ) {
            const isFollowed = await checkIsFollowing(
              String(username),
              session.user.username
            );
            setIsFollowing(isFollowed);
          }
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
      // Fetch replies (if you have an endpoint)
      axios
        .get(`/api/replies/${username}`)
        .then((res) => {
          setReplies(res.data.replies);
        })
        .catch(() => {
          setReplies([]); // fallback empty
        });
      // Fetch liked posts
      axios
        .get(`/api/posts/like`, { params: { username } })
        .then((res) => {
          setLikedPosts(res.data.likedPosts);
        })
        .catch(() => {
          setLikedPosts([]);
        });
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [username, session?.user]);

  async function follow() {
    try {
      setFollowLoading(true);
      const res = await axios.post("/api/user/follow", {
        followerUsername: session?.user.username,
        followingUsername: username,
      });
      setIsFollowing(res.data.followed);
    } catch (err) {
      console.error("Follow error", err);
    } finally {
      setFollowLoading(false);
    }
  }

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
        <section className="flex justify-between">
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
          {username !== session?.user.username && status !== "loading" && (
            <button
              className={`btn ${isFollowing ? "btn-ghost" : "btn-primary"}`}
              disabled={followLoading}
              onClick={follow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </section>
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
        {activeTab === "Posts" && posts && <Posts posts={posts} />}
        {activeTab === "Replies" &&
          (replies && replies.length > 0 ? (
            <Comments comment={replies} />
          ) : (
            <div className="p-8 flex justify-center items-center">
              <h1 className="text-2xl">No replies yet</h1>
            </div>
          ))}
        {activeTab === "Likes" &&
          (likedPosts && likedPosts.length > 0 ? (
            <Posts posts={likedPosts} />
          ) : (
            <div className="p-8 flex justify-center items-center">
              <h1 className="text-2xl">No liked posts yet</h1>
            </div>
          ))}
      </section>
    </div>
  );
}

export default Profile;
