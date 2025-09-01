import axios from "axios";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

function EditModal() {
  const { data: session } = useSession();
  const { userData, getUserInfo } = useAuthStore()
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
      if(session?.user) {
        getUserInfo(session?.user.username)
        setDisplayName(userData?.displayName ?? "")
      }
    }, [session?.user, getUserInfo, userData?.displayName])


  async function handleEditProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!displayName.trim()) {
      toast.error("Display Name is required");
    }

    try {
      const data = {
        username: session?.user.username,
        displayName: displayName,
      };

      await axios.post("/api/user/update-display-name", data);
      toast.success("Update display name successfully");
    } catch {
      toast.error("An error occured! Please try again later");
    }
  }

  return (
    <dialog id="my_modal_4" className="modal">
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
            onSubmit={handleEditProfile}
          >
            <div className="flex flex-col gap-2 items-start">
                <h1 className="text-xl font-semibold mb-5">Edit Profile</h1>
                <label className="label">Display Name</label>
                <input type="text" value={displayName} className="input w-full" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <button
              type="submit"
              className="btn btn-primary rounded-xl text-lg self-end"
              onClick={() => (document.getElementById('my_modal_4') as HTMLDialogElement | null)?.close()}
            >
              Save
            </button>
          </form>
        </section>
      </div>
    </dialog>
  );
}

export default EditModal;
