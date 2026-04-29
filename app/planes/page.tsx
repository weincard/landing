"use client"

import { useState, useEffect } from "react"
import { getToken } from "@/lib/auth"
import API_BASE from "@/lib/api"
import HeaderAuth from "@/components/header-auth"
import { MobileMenu } from "@/components/home-client"
import { CheckoutAuthModal } from "@/components/checkout-auth-modal"

interface UserMe {
  id: number
  name: string
  lastname?: string
  email?: string
  phone: string
}

interface Membership {
  id: number
  status: string
  planName?: string
  plan?: { name?: string }
  membershipPlan?: { name?: string; duration?: string }
  duration?: string
  expiresAt?: string
  endDate?: string
}

/** Duración del plan activo según memberships/by-user (misma lógica que header-auth). */
function getActivePlanKey(m: Membership | null): "monthly" | "yearly" | null {
  if (!m) return null
  const active = m.status === "active" || m.status === "ACTIVE"
  if (!active) return null
  const raw = m.membershipPlan?.duration ?? m.duration
  if (raw) {
    const u = String(raw).toUpperCase()
    if (u === "MONTHLY" || u === "MONTH") return "monthly"
    if (u === "YEARLY" || u === "YEAR") return "yearly"
  }
  const name = (
    m.membershipPlan?.name ??
    m.planName ??
    m.plan?.name ??
    ""
  ).toLowerCase()
  if (name.includes("mensual") || name.includes("monthly")) return "monthly"
  if (name.includes("anual") || name.includes("yearly") || name.includes("annual")) return "yearly"
  return null
}

const PLANS = [
  {
    key: "monthly" as const,
    label: "PLAN\nMENSUAL",
    price: "$18.900 COP/MES",
    priceNote: "por mes",
    description: "Accede a descuentos y beneficios exclusivos en los mejores restaurantes mes a mes.",
    highlighted: false,
  },
  {
    key: "yearly" as const,
    label: "PLAN\nANUAL",
    price: "$189.000 COP",
    priceNote: "por año — ahorra 2 meses",
    description: "El mejor precio para quienes salen seguido. Dos meses gratis frente al plan mensual.",
    highlighted: true,
  },
]

export default function PlanesPage() {
  const [user, setUser] = useState<UserMe | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [checkoutOpened, setCheckoutOpened] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authModal, setAuthModal] = useState<"monthly" | "yearly" | null>(null)
  const [pendingPlan, setPendingPlan] = useState<"monthly" | "yearly" | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoadingUser(false)
      return
    }
    Promise.all([
      fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE}/memberships/by-user`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([meData, membershipData]) => {
        if (meData) setUser(meData)
        if (membershipData) {
          const memberships = membershipData.userMemberships ?? membershipData
          const m = Array.isArray(memberships) ? memberships[0] : memberships
          if (m) setMembership(m)
        }
      })
      .catch(() => { })
      .finally(() => setLoadingUser(false))
  }, [])

  const hasMembership =
    membership?.status === "active" ||
    membership?.status === "ACTIVE"

  const activePlanKey = getActivePlanKey(membership)

  const membershipName =
    membership?.planName ??
    membership?.membershipPlan?.name ??
    membership?.plan?.name ??
    "Plan activo"

  const membershipExpiry = membership?.expiresAt ?? membership?.endDate

  async function startCheckout(planKey: "monthly" | "yearly", emailToUse: string) {
    setError(null)
    setPurchasing(true)
    setCheckoutOpened(false)
    const token = getToken()
    try {
      const res = await fetch(`${API_BASE}/memberships/session/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: emailToUse, membershipPlan: planKey }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message ?? "No se pudo iniciar el proceso de pago.")
      }
      const data = await res.json()
      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer")
        setCheckoutOpened(true)
        setPendingPlan(null)
      } else {
        throw new Error("No se recibió la URL de pago.")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al procesar el pago.")
    } finally {
      setPurchasing(false)
    }
  }

  async function handleSelectPlan(planKey: "monthly" | "yearly") {
    if (activePlanKey === planKey) return
    const token = getToken()
    if (!token) {
      setAuthModal(planKey)
      return
    }

    // Re-fetch user to get latest email
    const meRes = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    const meData: UserMe | null = meRes.ok ? await meRes.json() : null
    if (meData) setUser(meData)

    if (!meData?.email) {
      setPendingPlan(planKey)
      setEmailInput("")
      setEmailError(null)
      return
    }

    await startCheckout(planKey, meData.email)
  }

  async function handleAuthSuccess(email: string) {
    const plan = authModal!
    setAuthModal(null)

    // Refresh user and membership state in the background
    const token = getToken()
    if (token) {
      Promise.all([
        fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : null),
        fetch(`${API_BASE}/memberships/by-user`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : null),
      ]).then(([meData, membershipData]) => {
        if (meData) setUser(meData)
        if (membershipData) {
          const memberships = membershipData.userMemberships ?? membershipData
          const m = Array.isArray(memberships) ? memberships[0] : memberships
          if (m) setMembership(m)
        }
      }).catch(() => {})
    }

    await startCheckout(plan, email)
  }

  async function handleSaveEmailAndCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!emailInput.trim() || !pendingPlan) return
    setEmailError(null)
    setSavingEmail(true)

    try {
      const token = getToken()
      const meRes = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      if (!meRes.ok) throw new Error("No se pudo obtener el usuario.")
      const meData: UserMe = await meRes.json()
      const userId = meData.id ?? (meData as unknown as Record<string, unknown>).userId

      if (!userId) throw new Error("ID de usuario no disponible.")

      const updateRes = await fetch(`${API_BASE}/users/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: emailInput.trim() }),
      })
      if (!updateRes.ok) throw new Error("No se pudo guardar el correo.")

      setUser((prev) => prev ? { ...prev, email: emailInput.trim() } : prev)
      await startCheckout(pendingPlan, emailInput.trim())
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : "Error al guardar el correo.")
    } finally {
      setSavingEmail(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <a href="/">
            <img src="/logo-weincard.png" alt="Weincard" className="h-4 md:h-6" />
          </a>
          <div className="flex gap-3 items-center">
            <nav className="hidden md:flex gap-4 text-xl font-extralight font-hepta-slab text-white">
              <a href="/catalogo" className="hover:opacity-70 transition">RESTAURANTES</a>
              <span>|</span>
              <a href="/planes" className="hover:opacity-70 transition">PLANES</a>
            </nav>
            <MobileMenu />
            <HeaderAuth />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-14">
          <h1 className="font-clash font-black text-4xl md:text-5xl text-black tracking-tight mb-4">
            ELIGE TU PLAN
          </h1>
          <p className="font-hepta-slab text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
            Multiplica tus salidas a comer. Cancela cuando quieras.
          </p>
        </div>

        {/* Active membership banner */}
        {!loadingUser && hasMembership && (
          <div className="mb-12 rounded-2xl bg-black text-white px-6 py-5 flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div>
              <p className="font-clash font-bold text-lg">
                Tienes una membresía activa: {membershipName}
              </p>
              {membershipExpiry && (
                <p className="text-sm text-white/60 mt-1">
                  Vigente hasta{" "}
                  {new Date(membershipExpiry).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
            <span className="inline-block self-start md:self-auto bg-[#FF3B47] text-white text-xs font-bold font-clash px-4 py-1.5 rounded-full tracking-wider">
              ACTIVA
            </span>
          </div>
        )}

        {/* Checkout opened message */}
        {checkoutOpened && (
          <div className="mb-10 rounded-2xl border border-green-300 bg-green-50 px-6 py-5">
            <p className="font-clash font-bold text-green-800 text-base mb-1">
              Pasarela de pago abierta en otra pestaña
            </p>
            <p className="font-hepta-slab text-green-700 text-sm leading-relaxed">
              Si ya completaste el pago exitosamente,{" "}
              <button
                onClick={() => window.location.reload()}
                className="underline font-bold hover:text-green-900 transition"
              >
                recarga esta página
              </button>{" "}
              para que los cambios se vean reflejados en tu cuenta.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-10 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
            <p className="font-hepta-slab text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Inline email capture when missing */}
        {pendingPlan && (
          <div className="mb-10 rounded-2xl border border-yellow-300 bg-yellow-50 px-6 py-6">
            <p className="font-clash font-bold text-yellow-900 text-base mb-1">
              Necesitamos tu correo electrónico
            </p>
            <p className="font-hepta-slab text-yellow-800 text-sm mb-4 leading-relaxed">
              Para procesar el pago del{" "}
              <span className="font-bold">{pendingPlan === "monthly" ? "Plan Mensual" : "Plan Anual"}</span>{" "}
              necesitamos asociar un correo a tu cuenta.
            </p>
            <form onSubmit={handleSaveEmailAndCheckout} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="tu@correo.com"
                className="flex-1 px-4 py-3 border border-yellow-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingEmail || !emailInput.trim()}
                  className="px-6 py-3 rounded-xl bg-black text-white font-clash font-bold text-sm hover:bg-black/80 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {savingEmail && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {savingEmail ? "Guardando..." : "Guardar y pagar"}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingPlan(null)}
                  className="px-4 py-3 rounded-xl border border-gray-300 text-sm font-hepta-slab hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
            {emailError && (
              <p className="mt-3 text-sm text-red-600 font-hepta-slab">{emailError}</p>
            )}
          </div>
        )}

        {/* Plans grid — same style as homepage */}
        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`text-black rounded-3xl p-8 md:p-12 flex flex-col gap-6 border transition-all ${plan.highlighted
                ? "bg-black text-white border-white/10 shadow-2xl"
                : "bg-black text-white border-white/10 shadow-md"
                }`}
              style={
                plan.highlighted
                  ? { background: "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0.1), transparent)", border: "1px solid rgba(255,255,255,0.1)" }
                  : { background: "linear-gradient(to top, rgba(255,255,255,0.4), rgba(255,255,255,0.1), transparent)", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              {plan.highlighted && (
                <span className="self-start text-xs font-clash font-bold px-3 py-1 rounded-full bg-[#FF3B47] text-white tracking-widest">
                  RECOMENDADO
                </span>
              )}
              <div>
                <h2 className="font-hepta-slab font-light text-2xl md:text-3xl tracking-tight whitespace-pre-line leading-tight">
                  <span className="font-clash font-bold text-black">PLAN</span>
                  {"\n"}
                  <span className="text-black">{plan.key === "monthly" ? "MENSUAL" : "ANUAL"}</span>
                </h2>
              </div>
              <div>
                <p className="font-hepta-slab text-2xl md:text-3xl text-black">{plan.price}</p>
                <p className="text-sm text-white/60 font-hepta-slab mt-1">{plan.priceNote}</p>
              </div>
              <p className="font-hepta-slab text-sm text-black leading-relaxed flex-1">
                {plan.description}
              </p>
              <button
                type="button"
                onClick={() => handleSelectPlan(plan.key)}
                disabled={purchasing || activePlanKey === plan.key}
                title={
                  activePlanKey === plan.key
                    ? "Ya tienes este plan activo"
                    : undefined
                }
                className="w-full py-3 rounded-xl font-clash font-bold text-sm transition bg-white text-black hover:text-white hover:bg-black disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {purchasing && (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                )}
                {activePlanKey === plan.key
                  ? "Plan actual"
                  : hasMembership
                    ? "Quiero este plan"
                    : "Adquirir plan"}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center font-hepta-slab text-gray-500 text-sm mt-8">
          Cancela cuando quieras. Sin permanencia.
        </p>
      </div>

      {authModal && (
        <CheckoutAuthModal
          planKey={authModal}
          onSuccess={handleAuthSuccess}
          onClose={() => setAuthModal(null)}
        />
      )}
    </main>
  )
}
