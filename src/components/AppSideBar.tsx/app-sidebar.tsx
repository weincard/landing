"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  mainItems,
  oldItems,
  otherInformationItems,
  settingsItems,
} from "./sideBarItems";
import { CustomMenuItem } from "./CustomMenuItem";
import { ChevronDown } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  // Función para determinar si una ruta debe mostrarse en rojo

  return (
    <Sidebar
      collapsible="offcanvas"
      className="md:flex hidden bg-[#2D1B69] text-white"
    >
      <SidebarHeader className="p-6">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="ZonaPet"
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
        <SidebarGroup>
          <SidebarGroupLabel>Other Information</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherInformationItems.map((item) => (
                <CustomMenuItem
                  key={item.href}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <CustomMenuItem
                  key={item.href}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Old
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {oldItems.map((item) => (
                    <CustomMenuItem
                      key={item.href}
                      title={item.title}
                      href={item.href}
                      icon={item.icon}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
