"use client"

import axios from "axios";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  username: string;
  displayName: string;
  profilePic: string
}

function People() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isFollowingMap, setIsFollowingMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});
  const [searchInput, setSearchInput] = useState<string>("")

  useEffect(() => {
    if (!session?.user?.username) return;

    async function fetchUsers() {
      const res = await axios.get("/api/user/user-to-follow/all", {
        params: { username: session?.user.username },
      });
      setUsers(res.data.users);

      const followStatuses = await Promise.all(
        res.data.users.map(async (user: User) => {
          const status = await checkIsFollowing(
            user.username,
            session?.user.username
          );
          return { username: user.username, isFollowing: status };
        })
      );

      const followMap: { [key: string]: boolean } = {};
      followStatuses.forEach((item) => {
        followMap[item.username] = item.isFollowing;
      });

      setIsFollowingMap(followMap);
    }

    fetchUsers();
  }, [session]);

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

  async function follow(username: string) {
    try {
      setLoadingMap((prev) => ({ ...prev, [username]: true }));

      const res = await axios.post("/api/user/follow", {
        followerUsername: session?.user.username,
        followingUsername: username,
      });

      setIsFollowingMap((prev) => ({
        ...prev,
        [username]: res.data.followed,
      }));
    } catch (err) {
      console.error("Follow error", err);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [username]: false }));
    }
  }

  const filteredUsers: User[] = users.filter((user) => user.username.startsWith(searchInput));

  return (
    <div className="h-screen p-5 gap-y-5 w-[38rem] flex flex-col overflow-y-scroll">
      <section>
        <label className="input w-full rounded-xl">
          <Search />
          <input type="text" className="grow" placeholder="Search" onChange={(e) => setSearchInput(e.target.value)} />
        </label>
      </section>

      <section className="">
        <h2 className="text-2xl font-bold">People to follow</h2>
        <div className="flex flex-col">
          {filteredUsers.map((person, index) => (
            <div key={index} className="flex justify-between my-2 gap-3 hover:bg-base-300 p-2 rounded-md duration-300">
              <div className="flex gap-3">
                <Image src={ person.profilePic || "/avatar.png" } alt="profile" width={50} height={50} className="rounded-full object-cover" />
                <div className="flex flex-col">
                  <Link href={`/profile/${person.username}`} className="font-semibold">{person.displayName}</Link>
                  <p className="text-gray-400">@{person.username}</p>
                </div>
              </div>
              {person.username !== session?.user.username && status !== "loading" && (
                <button
                  className={`btn rounded-xl ${isFollowingMap[person.username] ? "btn-ghost" : "btn-primary"}`}
                  disabled={loadingMap[person.username]}
                  onClick={() => follow(person.username)}
                >
                  {isFollowingMap[person.username] ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default People;
