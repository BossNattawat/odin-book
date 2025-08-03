import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand"

interface UserData {
    username: string;
    displayName: string;
    profilePic: string;
}

interface Store {
    userData: null | UserData
    getUserInfo: (data: string) => void
}

export const useAuthStore = create<Store>((set) => ({
    userData: null,

    getUserInfo: async (data) => {
        try {
            await axios.get(`/api/user/${data}`)
                .then((res) => {
                    set({ userData: res.data.user })
                })
        }
        catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        }
    }
}))