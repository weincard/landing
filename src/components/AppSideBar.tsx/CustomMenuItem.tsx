"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export const CustomMenuItem = ({
  title,
  href,
  icon: Icon,
}: {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Función para obtener el color del texto según la ruta

  return (
    <SidebarMenuItem key={href}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href} className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
