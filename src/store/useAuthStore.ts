import toast from "react-hot-toast"
import { create } from "zustand"

interface sessionData {
    user: User
}

interface User {
    displayName: string
    username: string
}

interface Store {
    authUser: null | User
    checkAuth: (sessionData: sessionData) => void
}

export const useAuthStore = create<Store>((set) => ({
    authUser: null,
    checkAuth: async(sessionData) => {
        try {
            const data = {
                displayName: sessionData?.user?.displayName,
                username: sessionData?.user?.username
            }
            set({authUser: data})
        }
        catch {
            toast.error("Error in checkAuth")
            set({authUser: null})
        }
    },
}))