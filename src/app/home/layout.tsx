import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Explore from "../components/Explore";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center">
      <Sidebar />
      {children}
      <Explore />
    </div>
  );
}
