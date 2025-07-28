"use client";

import axios from "axios";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  username: string;
  displayName: string;
}

function Explore() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isFollowingMap, setIsFollowingMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!session?.user?.username) return;

    async function fetchUsers() {
      const res = await axios.get("/api/user/user-to-follow", {
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

  return (
    <aside className="min-h-screen border-l-[1px] border-slate-600 px-8 py-3 min-w-[26rem] hidden xl:flex flex-col gap-8">
      <section>
        <label className="input w-full rounded-xl">
          <Search />
          <input type="text" className="grow" placeholder="Search" />
        </label>
      </section>

      <section className="p-5 border-[2px] border-slate-600 rounded-xl">
        <h2 className="text-xl font-medium">People to follow</h2>
        <div className="flex flex-col">
          {users.length > 0 ? (
            <>
              {users.map((person, index) => (
                <div
                  key={index}
                  className="flex justify-between my-2 gap-3 hover:bg-base-300 p-2 rounded-md duration-300"
                >
                  <div className="flex gap-3">
                    <Image
                      src="/avatar.png"
                      alt="profile"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <Link
                        href={`/profile/${person.username}`}
                        className="font-semibold"
                      >
                        {person.displayName}
                      </Link>
                      <p className="text-gray-400">@{person.username}</p>
                    </div>
                  </div>
                  {person.username !== session?.user.username &&
                    status !== "loading" && (
                      <button
                        className={`btn rounded-xl ${
                          isFollowingMap[person.username]
                            ? "btn-ghost"
                            : "btn-primary"
                        }`}
                        disabled={loadingMap[person.username]}
                        onClick={() => follow(person.username)}
                      >
                        {isFollowingMap[person.username]
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                    )}
                </div>
              ))}
            </>
          ) : (
            <div className="py-5">
              <h1 className="text-lg">You&apos;ve followed all users!</h1>
            </div>
          )}
        </div>
        <Link href="/people-to-follow" className="text-blue-400">
          Show more
        </Link>
      </section>
    </aside>
  );
}

export default Explore;
