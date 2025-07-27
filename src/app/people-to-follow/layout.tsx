import Explore from "@/app/components/Explore";
import Sidebar from "@/app/components/Sidebar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center">
      <Sidebar />
      {children}
      <Explore />
    </div>
  );
}
