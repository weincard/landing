"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { saveToken } from "@/lib/auth"

const API_BASE = "https://azucq9v6zc.execute-api.us-east-1.amazonaws.com/prod"

interface RegisterFormData {
  firstName: string
  lastName: string
  phone: string
}

export default function RegistroPage() {
  const router = useRouter()
  const [form, setForm] = useState<RegisterFormData>({ firstName: "", lastName: "", phone: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "phone") {
      // Only allow digits, max 10
      const digits = value.replace(/\D/g, "").slice(0, 10)
      setForm((prev) => ({ ...prev, phone: digits }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.phone.length !== 10) {
      setError("El número de celular debe tener exactamente 10 dígitos.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/login-or-create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+57${form.phone}`,
          name: `${form.firstName.trim()} ${form.lastName.trim()}`,
          roleName: "client",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.message ?? "Error al registrarse. Intenta de nuevo.")
        return
      }

      saveToken(data.token)
      router.push("/")
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = isLoading || !form.firstName.trim() || !form.lastName.trim() || form.phone.length !== 10

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <a href="/">
            <Image src="/logo-weincard.png" alt="Weincard" width={120} height={24} className="h-5 w-auto" />
          </a>
          <a href="/login" className="text-sm font-hepta-slab text-white hover:opacity-70 transition">
            ¿Ya tienes cuenta? <span className="font-bold underline">Inicia sesión</span>
          </a>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 md:p-10 space-y-8">
          {/* Title */}
          <div className="space-y-1">
            <h1 className="font-clash font-bold text-2xl md:text-3xl text-black tracking-tight">CREAR CUENTA</h1>
            <p className="text-sm text-gray-500 font-hepta-slab">Completa tus datos para comenzar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Nombre */}
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nombre <span className="text-[#FF3B47]">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Juan"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
              />
            </div>

            {/* Apellido */}
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Apellido <span className="text-[#FF3B47]">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Pérez"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
              />
            </div>

            {/* Celular */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Número de celular <span className="text-[#FF3B47]">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 text-sm font-medium select-none">
                  +57
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="3001234567"
                  maxLength={10}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
                />
              </div>
              <p className="text-xs text-gray-400">10 dígitos sin el indicativo.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full py-3 rounded-full bg-black text-white font-hepta-slab font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 font-hepta-slab">
            Al registrarte aceptas nuestros{" "}
            <a href="/terminos-y-condiciones" className="underline hover:text-gray-600">
              Términos y condiciones
            </a>{" "}
            y{" "}
            <a href="/politica-de-privacidad" className="underline hover:text-gray-600">
              Política de privacidad
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
