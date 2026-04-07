"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getToken } from "@/lib/auth"

function getAppStoreUrl(): string {
  if (typeof window === "undefined") return "https://apps.apple.com/co/app/weincard/id6754571134"
  const ua = window.navigator.userAgent
  const isAndroidOrWindows = /Android|Windows/i.test(ua)
  if (isAndroidOrWindows) {
    return "https://play.google.com/store/apps/details?id=com.weincard.app.idp"
  }
  return "https://apps.apple.com/co/app/weincard/id6754571134"
}

export function ViewAppButton() {
  const [url, setUrl] = useState("https://apps.apple.com/co/app/weincard/id6754571134")

  useEffect(() => {
    setUrl(getAppStoreUrl())
  }, [])

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Button className="rounded-full bg-black text-white font-bold hover:bg-black/90 px-8 mt-6 font-hepta-slab text-lg cursor-pointer">
        Ver la App
      </Button>
    </a>
  )
}

export function JoinNowButton() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    setLoggedIn(!!getToken())
  }, [])

  if (loggedIn === null || loggedIn) return null

  return (
    <a href="/registro">
      <Button className="rounded-full bg-white text-black hover:bg-white/90 px-8 font-bold font-hepta-slab text-lg mt-6 cursor-pointer">
        Únete ahora
      </Button>
    </a>
  )
}

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest("[data-mobile-menu]")) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div className="relative md:hidden" data-mobile-menu>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="flex flex-col justify-center items-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {open ? (
          // X icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white" aria-hidden="true">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        ) : (
          // Hamburger icon
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white" aria-hidden="true">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50">
          <a
            href="/catalogo"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-bold font-hepta-slab text-black hover:bg-gray-50 transition"
          >
            RESTAURANTES
          </a>
          <div className="border-t border-gray-100" />
          <a
            href="/planes"
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-3 text-sm font-bold font-hepta-slab text-black hover:bg-gray-50 transition"
          >
            PLANES
          </a>
        </div>
      )}
    </div>
  )
}

export function FooterSubscribeLink() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    setLoggedIn(!!getToken())
  }, [])

  if (loggedIn === null || loggedIn) return null

  return (
    <>
      <span className="hidden md:inline text-white">|</span>
      <a href="/registro" className="hover:text-white/70 transition">
        SUBSCRÍBETE
      </a>
    </>
  )
}
