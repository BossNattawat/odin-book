"use client";

import Link from "next/link";
import {
  Atom,
  EllipsisVertical,
  House,
  LogOut,
  Send,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import PostModal from "./PostModal";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Sidebar() {
  const { data: session, status } = useSession();
  const { userData, getUserInfo } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user) {
      getUserInfo(session?.user.username);
    }
  }, [session?.user, getUserInfo]);

  if (!userData && status === "loading") {
    <div className="min-h-screen w-full flex justify-center items-center">
      <span className="loading loading-ring loading-xl"></span>
    </div>;
  }

  return (
    <aside className="min-h-screen border-r-[1px] border-slate-600 px-3 lg:px-8 py-3 flex flex-col items-center md:items-start">
      <Link
        href={"/home"}
        className="text-3xl font-semibold mb-6 flex gap-x-2 justify-center items-center"
      >
        <Atom size={40} />
        <span className="hidden md:flex">Atomic</span>
      </Link>
      <ul className="flex flex-col gap-y-8 mb-8">
        <Link href="/" className="flex items-center text-2xl gap-5">
          <House size={30} />
          <p className="hidden md:flex">Home</p>
        </Link>
        <Link
          href={`/profile/${session?.user?.username}`}
          className="flex items-center text-2xl gap-5"
        >
          <User size={30} />
          <p className="hidden md:flex">My Profile</p>
        </Link>
        <button
          onClick={() =>
            (
              document.getElementById("my_modal_3") as HTMLDialogElement | null
            )?.showModal?.()
          }
          className="rounded-xl items-center text-2xl gap-5 flex md:hidden text-primary"
        >
          <Send />
        </button>
        <button
          onClick={() => signOut()}
          className="flex items-center text-2xl gap-5 md:hidden text-red-500"
        >
          <LogOut />
        </button>
      </ul>
      <button
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement | null
          )?.showModal?.()
        }
        className="btn btn-primary rounded-xl w-full text-xl hidden md:flex"
      >
        Post
      </button>
      <section className="flex gap-3 mt-8 cursor-pointer hover:bg-base-300 p-2 rounded-md duration-300">
        <Image
          src={userData?.profilePic || "/avatar.png"}
          alt="profile"
          width={50}
          height={50}
          className="rounded-full object-cover w-16 lg:w-12"
        />
        <div className="flex-col hidden md:flex">
          <p className="font-semibold">
            {userData?.displayName || "Display Name"}
          </p>
          <p className="text-gray-400">@{userData?.username || "Username"}</p>
        </div>
        <div className="dropdown dropdown-top dropdown-left cursor-pointer">
          <button tabIndex={0} role="button" className="ml-5 hidden md:flex">
            <EllipsisVertical size={18} />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-3 shadow-sm"
          >
            <li>
              <button
                onClick={() => signOut()}
                className="btn btn-error btn-soft btn-sm"
              >
                Logout @{userData?.username}
              </button>
            </li>
          </ul>
        </div>
      </section>
      <PostModal />
    </aside>
  );
}

export default Sidebar;
