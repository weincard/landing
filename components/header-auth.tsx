"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { getToken, clearAuth, type AuthUser } from "@/lib/auth"
import API_BASE from "@/lib/api"

const ME_URL = `${API_BASE}/auth/me`
const MEMBERSHIP_URL = `${API_BASE}/memberships/by-user`

export default function HeaderAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [membershipName, setMembershipName] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    Promise.all([
      fetch(ME_URL, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (!res.ok) { clearAuth(); return null }
          return res.json()
        }),
      fetch(MEMBERSHIP_URL, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([meData, membershipData]) => {
        if (meData) setUser(meData)
        if (membershipData) {
          // Response shape: { userMemberships: [...] }
          const memberships = membershipData.userMemberships ?? membershipData
          const m = Array.isArray(memberships) ? memberships[0] : memberships
          if (m && (m.status === "active" || m.status === "ACTIVE")) {
            // Map duration to Spanish
            const durationMap: Record<string, string> = {
              MONTHLY: "Mensual",
              YEARLY: "Anual",
              monthly: "Mensual",
              yearly: "Anual",
            }
            const duration = m.membershipPlan?.duration ?? m.duration
            const durationLabel = durationMap[duration] ?? ""
            const planName = m.membershipPlan?.name ?? m.planName ?? m.plan?.name
            setMembershipName(planName ?? (durationLabel ? `Plan ${durationLabel}` : "Plan activo"))
          }
        }
      })
      .catch(() => clearAuth())
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLogout() {
    clearAuth()
    setUser(null)
    setOpen(false)
    window.location.reload()
  }

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" aria-hidden="true" />
  }

  if (!user) {
    return (
      <Button asChild className="rounded-full bg-white text-black hover:bg-white/90 font-hepta-slab font-bold">
        <a href="/login">INICIAR SESIÓN</a>
      </Button>
    )
  }

  const initials = `${user.name?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase()
  const fullName = [user.name, user.lastname].filter(Boolean).join(" ")

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Menú de usuario"
        aria-expanded={open}
        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold font-clash text-sm hover:bg-white/90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {initials || (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-hepta-slab uppercase tracking-wide mb-1">Sesión iniciada</p>
            <p className="font-bold text-sm text-black font-clash truncate">{fullName}</p>
            {membershipName ? (
              <span className="inline-block mt-2 text-xs font-clash font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                {membershipName}
              </span>
            ) : (
              <a
                href="/planes"
                onClick={() => setOpen(false)}
                className="inline-block mt-2 text-xs font-clash font-bold px-3 py-1 rounded-full bg-[#FF3B47]/10 text-[#FF3B47] hover:bg-[#FF3B47]/20 transition"
              >
                Ver planes
              </a>
            )}
          </div>
          <div className="px-3 py-3">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-hepta-slab text-red-600 font-semibold hover:bg-red-50 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
