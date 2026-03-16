"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { saveToken } from "@/lib/auth"

const API_BASE = "https://azucq9v6zc.execute-api.us-east-1.amazonaws.com/prod"

type Step = "phone" | "otp"

export default function LoginPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus first OTP input when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }, [step])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10)
    setPhone(digits)
  }

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const next = [...otp]
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] ?? ""
    }
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (phone.length !== 10) {
      setError("El número de celular debe tener exactamente 10 dígitos.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+57${phone}` }),
      })

      const data = await res.json()

      if (res.status !== 201 && !res.ok) {
        setError(data?.message ?? "Error al enviar el código. Intenta de nuevo.")
        return
      }

      setSuccessMsg(data?.message ?? "Código OTP enviado por WhatsApp")
      setStep("otp")
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const code = otp.join("")
    if (code.length !== 6) {
      setError("Ingresa el código de 6 dígitos completo.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+57${phone}`, code }),
      })

      const data = await res.json()

      if (res.status !== 201 && !res.ok) {
        setError(data?.message ?? "Código incorrecto o expirado. Intenta de nuevo.")
        return
      }

      saveToken(data.accessToken)
      router.push("/")
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async () => {
    setError("")
    setSuccessMsg("")
    setOtp(["", "", "", "", "", ""])
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+57${phone}` }),
      })
      const data = await res.json()
      if (res.status !== 201 && !res.ok) {
        setError(data?.message ?? "Error al reenviar el código.")
        return
      }
      setSuccessMsg("Código reenviado por WhatsApp.")
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const otpFilled = otp.every((d) => d !== "")

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <a href="/">
            <Image src="/logo-weincard.png" alt="Weincard" width={120} height={24} className="h-5 w-auto" />
          </a>
          <a href="/registro" className="text-sm font-hepta-slab text-white hover:opacity-70 transition">
            ¿No tienes cuenta? <span className="font-bold underline">Regístrate</span>
          </a>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 md:p-10 space-y-8">

          {/* Step: Phone */}
          {step === "phone" && (
            <>
              <div className="space-y-1">
                <h1 className="font-clash font-bold text-2xl md:text-3xl text-black tracking-tight">INICIAR SESIÓN</h1>
                <p className="text-sm text-gray-500 font-hepta-slab">
                  Te enviaremos un código por WhatsApp.
                </p>
              </div>

              <form onSubmit={requestOtp} className="space-y-5" noValidate>
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
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="3001234567"
                      maxLength={10}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
                    />
                  </div>
                  <p className="text-xs text-gray-400">10 dígitos sin el indicativo.</p>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || phone.length !== 10}
                  className="w-full py-3 rounded-full bg-black text-white font-hepta-slab font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {isLoading ? "Enviando código..." : "Enviar código"}
                </button>
              </form>
            </>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <>
              <div className="space-y-1">
                <h1 className="font-clash font-bold text-2xl md:text-3xl text-black tracking-tight">VERIFICA TU CÓDIGO</h1>
                <p className="text-sm text-gray-500 font-hepta-slab">
                  Ingresa el código de 6 dígitos enviado por WhatsApp al{" "}
                  <span className="font-bold text-gray-700">+57 {phone}</span>.
                </p>
              </div>

              {successMsg && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  {successMsg}
                </div>
              )}

              <form onSubmit={verifyOtp} className="space-y-6" noValidate>
                {/* OTP inputs */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Código OTP <span className="text-[#FF3B47]">*</span>
                  </label>
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
                        className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition caret-transparent"
                        aria-label={`Dígito ${i + 1} del código OTP`}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !otpFilled}
                  className="w-full py-3 rounded-full bg-black text-white font-hepta-slab font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {isLoading ? "Verificando..." : "Verificar código"}
                </button>
              </form>

              <div className="flex items-center justify-between text-sm font-hepta-slab">
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setError(""); setSuccessMsg(""); setOtp(["", "", "", "", "", ""]) }}
                  className="text-gray-500 hover:text-black transition underline"
                >
                  Cambiar número
                </button>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={isLoading}
                  className="text-[#FF3B47] hover:text-[#cc2f3a] transition font-bold disabled:opacity-50"
                >
                  Reenviar código
                </button>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  )
}
