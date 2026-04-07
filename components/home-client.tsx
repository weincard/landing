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
