import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppSidebar } from "@/components/AppSideBar.tsx/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppBar } from "@/components/appbar";
import { getUserCookiesServer } from "@/utilities/helpers/handleUserCookies/getUserCookieServer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weincard Dashboard",
  description: "Admin dashboard for Weincard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserCookiesServer();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <AppBar
            user={user!}
            className="fixed top-0 right-0 left-0 z-30 bg-white border-b"
          />
          <main className="mt-16 p-6 bg-[#FFF6F4] h-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
