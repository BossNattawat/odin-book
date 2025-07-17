/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

function Profile() {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState<null | any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`/api/user/${username}`)
      .then((res) => {
        setUserInfo(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch user data");
        setLoading(false);
      });
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

  if (!userInfo) {
    return (
      <div className="min-h-screen w-[38rem] flex justify-center items-center">
        <h1>User not found</h1>
      </div>
    );
  }

  console.log();

  return (
    <div className="h-screen py-3 w-[38rem] flex flex-col overflow-y-scroll p-8">
      <section className="flex flex-col gap-y-3">
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
    </div>
  );
}

export default Profile;
