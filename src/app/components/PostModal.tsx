import axios from "axios";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";

function PostModal() {
  const { data: session } = useSession();

  const [postContent, setPostContent] = useState<string>("");

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
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <X/>
          </button>
        </form>
        <section className="flex flex-col gap-y-3 mt-3">
          <form
            className="flex flex-col mt-5 gap-y-3"
            onSubmit={handleCreatePost}
          >
            <div className="flex flex-row gap-2 items-start">
              <Image
                src="/avatar.png"
                alt="profile"
                width={40}
                height={40}
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
              onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement | null)?.close()}
            >
              Post
            </button>
          </form>
        </section>
      </div>
    </dialog>
  );
}

export default PostModal;
