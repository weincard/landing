"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { getToken, clearAuth, type AuthUser } from "@/lib/auth"
import API_BASE from "@/lib/api"

const ME_URL = `${API_BASE}/auth/me`

export default function HeaderAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showUpdateName, setShowUpdateName] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [updateStatus, setUpdateStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    fetch(ME_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          clearAuth()
          return null
        }
        return res.json()
      })
      .then((data: AuthUser | null) => {
        if (data) setUser(data)
      })
      .catch(() => clearAuth())
      .finally(() => setLoading(false))
  }, [])

  // Close dropdown when clicking outside
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

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() && !lastName.trim()) return
    setIsUpdating(true)
    setUpdateStatus(null)

    try {
      const token = getToken()
      const meRes = await fetch(ME_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!meRes.ok) throw new Error("No se pudo obtener el usuario")
      const meData = await meRes.json()
      const userId = meData.id ?? meData.userId

      if (!userId) throw new Error("ID de usuario no disponible")

      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
      const updateRes = await fetch(`${API_BASE}/users/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: fullName }),
      })

      if (!updateRes.ok) throw new Error("No se pudo actualizar el nombre")

      setUser((prev) => prev ? { ...prev, name: firstName.trim(), lastname: lastName.trim() } : prev)
      setUpdateStatus({ type: "success", message: "Nombre actualizado correctamente" })
      setFirstName("")
      setLastName("")
    } catch (err: unknown) {
      setUpdateStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Error al actualizar",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" aria-hidden="true" />
    )
  }

  if (!user) {
    return (
      <Button
        asChild
        className="rounded-full bg-white text-black hover:bg-white/90 font-hepta-slab font-bold"
      >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-hepta-slab uppercase tracking-wide mb-1">
              Sesión iniciada
            </p>
            <p className="font-bold text-sm text-black font-clash truncate">{fullName}</p>
          </div>
          <div className="px-3 py-3 flex flex-col gap-1">
            <button
              onClick={() => {
                setShowUpdateName((prev) => !prev)
                setUpdateStatus(null)
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-hepta-slab text-black font-semibold hover:bg-gray-100 transition"
            >
              Actualizar nombre
            </button>

            {showUpdateName && (
              <form onSubmit={handleUpdateName} className="mt-1 flex flex-col gap-2 px-1">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="text-black w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="text-black w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent"
                />
                {updateStatus && (
                  <p className={`text-xs px-1 ${updateStatus.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {updateStatus.message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isUpdating || (!firstName.trim() && !lastName.trim())}
                  className="w-full py-2 rounded-xl text-sm font-hepta-slab font-bold bg-black text-white hover:bg-black/80 transition disabled:opacity-50"
                >
                  {isUpdating ? "Guardando..." : "Guardar"}
                </button>
              </form>
            )}

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
