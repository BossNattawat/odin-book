import { ReactNode } from "react";
import Explore from "../components/Explore";
import Sidebar from "../components/Sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {

    return (
        <main>
            <div className="flex justify-center">
                <Sidebar/>
                {children}
                <Explore/>
            </div>
        </main>
    )
}
