"use client"

import { useState, useRef } from "react"
import { saveToken, getToken } from "@/lib/auth"
import API_BASE from "@/lib/api"

type Step = "phone" | "otp" | "profile" | "email"

interface Props {
  planKey: "monthly" | "yearly"
  onSuccess: (email: string) => void
  onClose: () => void
}

export function CheckoutAuthModal({ planKey, onSuccess, onClose }: Props) {
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [userId, setUserId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const planLabel = planKey === "monthly" ? "Plan Mensual" : "Plan Anual"

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
  }

  const sendOtp = async () => {
    setError("")
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+57${phone}` }),
      })
      const data = await res.json()
      if (res.status !== 201 && !res.ok) {
        setError(data?.message ?? "Error al enviar el código.")
        return false
      }
      return true
    } catch {
      setError("Error de conexión.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length !== 10) {
      setError("El número debe tener exactamente 10 dígitos.")
      return
    }
    const ok = await sendOtp()
    if (ok) {
      setStep("otp")
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }

  const resendOtp = async () => {
    setOtp(["", "", "", "", "", ""])
    await sendOtp()
  }

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const next = [...otp]
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? ""
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join("")
    if (code.length !== 6) {
      setError("Ingresa el código de 6 dígitos completo.")
      return
    }
    setError("")
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+57${phone}`, code }),
      })
      const data = await res.json()
      if (res.status !== 201 && !res.ok) {
        setError(data?.message ?? "Código incorrecto o expirado.")
        return
      }
      saveToken(data.accessToken)

      // Detect new vs existing user by checking if name is set
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      })
      const meData = await meRes.json()
      setUserId(meData.id ?? meData.userId ?? null)

      if (!meData.name) {
        setStep("profile")
      } else if (!meData.email) {
        setStep("email")
      } else {
        onSuccess(meData.email)
      }
    } catch {
      setError("Error de conexión.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !emailInput.trim() || !userId) return
    setError("")
    setIsLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/users/update/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: emailInput.trim(),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setError(err?.message ?? "Error al guardar los datos.")
        return
      }
      onSuccess(emailInput.trim())
    } catch {
      setError("Error de conexión.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim() || !userId) return
    setError("")
    setIsLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/users/update/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: emailInput.trim() }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setError(err?.message ?? "Error al guardar el correo.")
        return
      }
      onSuccess(emailInput.trim())
    } catch {
      setError("Error de conexión.")
    } finally {
      setIsLoading(false)
    }
  }

  const otpFilled = otp.every((d) => d !== "")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <p className="text-xs font-clash font-bold text-[#FF3B47] tracking-widest mb-1 uppercase">
            {planLabel}
          </p>
          <h2 className="font-clash font-bold text-2xl text-black tracking-tight">
            {step === "phone" && "INGRESA TU NÚMERO"}
            {step === "otp" && "VERIFICA TU CÓDIGO"}
            {step === "profile" && "TUS DATOS"}
            {step === "email" && "TU CORREO"}
          </h2>
          <p className="text-sm text-gray-500 font-hepta-slab mt-1">
            {step === "phone" && "Te enviaremos un código por WhatsApp."}
            {step === "otp" && `Código de 6 dígitos enviado al +57 ${phone}.`}
            {step === "profile" && "Necesitamos tu nombre y correo para continuar."}
            {step === "email" && "Necesitamos tu correo para procesar el pago."}
          </p>
        </div>

        {/* Phone step */}
        {step === "phone" && (
          <form onSubmit={requestOtp} className="space-y-4" noValidate>
            <div className="flex">
              <span className="inline-flex items-center px-4 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 text-sm font-medium select-none">
                +57
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="3001234567"
                maxLength={10}
                autoFocus
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
              />
            </div>
            {error && <p className="text-sm text-red-600 font-hepta-slab">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || phone.length !== 10}
              className="w-full py-3 rounded-full bg-black text-white font-clash font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isLoading ? "Enviando..." : "Enviar código"}
            </button>
          </form>
        )}

        {/* OTP step */}
        {step === "otp" && (
          <form onSubmit={verifyOtp} className="space-y-4" noValidate>
            <div className="flex gap-2 justify-between">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={i === 0 ? handleOtpPaste : undefined}
                  className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition caret-transparent"
                  aria-label={`Dígito ${i + 1}`}
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-600 font-hepta-slab">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !otpFilled}
              className="w-full py-3 rounded-full bg-black text-white font-clash font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isLoading ? "Verificando..." : "Verificar y continuar"}
            </button>
            <div className="flex justify-between text-sm font-hepta-slab">
              <button
                type="button"
                onClick={() => { setStep("phone"); setError(""); setOtp(["", "", "", "", "", ""]) }}
                className="text-gray-500 underline hover:text-black transition"
              >
                Cambiar número
              </button>
              <button
                type="button"
                onClick={resendOtp}
                disabled={isLoading}
                className="text-[#FF3B47] font-bold hover:text-[#cc2f3a] transition disabled:opacity-50"
              >
                Reenviar código
              </button>
            </div>
          </form>
        )}

        {/* Profile step — new users only */}
        {step === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nombre *"
                autoFocus
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
              />
              <input
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Apellido *"
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
              />
            </div>
            <input
              type="email"
              autoComplete="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Correo electrónico *"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
            />
            {error && <p className="text-sm text-red-600 font-hepta-slab">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !firstName.trim() || !lastName.trim() || !emailInput.trim()}
              className="w-full py-3 rounded-full bg-black text-white font-clash font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isLoading ? "Guardando..." : "Continuar al pago"}
            </button>
          </form>
        )}

        {/* Email step — existing users without email */}
        {step === "email" && (
          <form onSubmit={handleSaveEmail} className="space-y-4" noValidate>
            <input
              type="email"
              autoComplete="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="tu@correo.com"
              autoFocus
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
            />
            {error && <p className="text-sm text-red-600 font-hepta-slab">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !emailInput.trim()}
              className="w-full py-3 rounded-full bg-black text-white font-clash font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isLoading ? "Guardando..." : "Ir al pago"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 font-hepta-slab">
          Al continuar aceptas nuestros{" "}
          <a href="/terminos-y-condiciones" className="underline hover:text-gray-600">Términos</a>{" "}
          y{" "}
          <a href="/politica-de-privacidad" className="underline hover:text-gray-600">Privacidad</a>.
        </p>
      </div>
    </div>
  )
}
