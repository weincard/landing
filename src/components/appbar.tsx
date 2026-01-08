"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Search, Bell, MessageSquare, Menu } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCookie } from "cookies-next";
import { CookiesKeysEnum } from "@/utilities/enums";
import { routes } from "@/config/routes/routes";
import { useRouter } from "next-nprogress-bar";
import { IUser } from "@/data/interfaces/user.interface";
import { NoSSR } from "./NoSSR";

interface AppBarProps {
  user?: IUser;
  className?: string;
}

export const AppBar = ({ user, className, ...props }: AppBarProps) => {
  const router = useRouter();

  function logout() {
    deleteCookie(CookiesKeysEnum.token);
    router.replace(routes.auth.login);
  }
  // console.log("USER:", user);

  return (
    <header
      className={cn(
        "h-16 px-4 flex items-center justify-between fixed top-0 right-0 left-0 z-30 bg-white border-b",
        className
      )}
      {...props}
    >
      {/* Sección izquierda */}
      <div className="flex items-center gap-4 lg:gap-16">
        {/* Botón de menú móvil */}
        <NoSSR fallback={<Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>}>
          <SidebarTrigger className="md:hidden">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </NoSSR>

        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Weincard Logo"
          width={170}
          height={50}
          className="hidden lg:block h-[40px] w-[170px] object-contain"
        />

        {/* Logo versión móvil (más pequeño) */}
        <Image
          src="/logo.png"
          alt="Weincard Logo"
          width={120}
          height={35}
          className="lg:hidden h-[35px] w-[120px] object-contain"
        />
      </div>

      {/* Barra de búsqueda - Desktop */}
      <div className="hidden md:block flex-1 max-w-md mx-4">
        <div className="relative">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 bg-gray-50"
          /> */}
        </div>
      </div>

      {/* Barra de búsqueda - Móvil */}
      <NoSSR fallback={<Button variant="ghost" size="icon" className="md:hidden"><Search className="h-5 w-5" /></Button>}>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="h-32">
            <div className="relative mt-4">
              {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 bg-gray-50"
              /> */}
            </div>
          </SheetContent>
        </Sheet>
      </NoSSR>

      {/* Sección derecha */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Botones de notificación - Se ocultan en móvil muy pequeño */}
        <div className="hidden sm:flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-blue-600 rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-blue-600 rounded-full" />
          </Button> */}
        </div>

        {/* Menú de usuario */}
        <NoSSR fallback={
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              {user?.name?.split("")[0] || "U"}
            </div>
            <span className="hidden md:inline">
              {user?.name || "Usuario"}
            </span>
          </Button>
        }>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  {user?.name?.split("")[0] || "U"}
                </div>
                {/* Nombre de usuario - Se oculta en móvil */}
                <span className="hidden md:inline">
                  {user?.name || "Usuario"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Información del usuario - Visible solo en móvil */}
              <div className="md:hidden px-2 py-1.5 text-sm">
                <div className="font-medium">{user?.name || "Usuario"}</div>
                <div className="text-muted-foreground">
                  {user?.email || "correo@ejemplo.com"}
                </div>
              </div>
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              {/* Mostrar notificaciones en el menú en móvil muy pequeño */}
              <div className="sm:hidden">
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Mensajes</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notificaciones</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NoSSR>
      </div>
    </header>
  );
};
