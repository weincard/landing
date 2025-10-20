"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next-nprogress-bar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { mainItems } from "./sideBarItems";
import { CustomMenuItem } from "./CustomMenuItem";
import { CookiesKeysEnum } from "@/utilities/enums";
import { routes } from "@/config/routes/routes";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    deleteCookie(CookiesKeysEnum.token);
    router.replace(routes.auth.login);
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="md:flex hidden bg-[#2D1B69] text-white"
    >
      <SidebarHeader className="p-6">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="Weincard"
            width={120}
            height={40}
            className="h-8 bg-white rounded-sm"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          {/* Items principales */}
          {mainItems.map((item) => (
            <CustomMenuItem
              key={item.href}
              title={item.title}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer con botón de logout */}
      <SidebarFooter className="px-4 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="w-full text-white hover:bg-white/10 transition-colors"
              tooltip="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
