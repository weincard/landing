"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"
import API_BASE from "@/lib/api"

const ME_URL = `${API_BASE}/auth/me`
const PLANS_URL = `${API_BASE}/membership-plans`

interface Plan {
  id: number
  name: string
  description: string
  price: number
  durationDays: number
  features?: string[]
}

interface UserMe {
  id: number
  name: string
  lastname?: string
  email?: string
  phone: string
  roleId?: number
  isVerified?: boolean
  membership?: {
    planName?: string
    status?: string
    expiresAt?: string
  }
}

export default function PlanesPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [user, setUser] = useState<UserMe | null>(null)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [loadingUser, setLoadingUser] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseStatus, setPurchaseStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchPlans()
    fetchUser()
  }, [])

  async function fetchPlans() {
    try {
      const res = await fetch(PLANS_URL)
      if (res.ok) {
        const data = await res.json()
        setPlans(Array.isArray(data) ? data : data.plans ?? [])
      }
    } catch {
      // silent
    } finally {
      setLoadingPlans(false)
    }
  }

  async function fetchUser() {
    const token = getToken()
    if (!token) {
      setLoadingUser(false)
      return
    }
    try {
      const res = await fetch(ME_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch {
      // silent
    } finally {
      setLoadingUser(false)
    }
  }

  function handleSelectPlan(plan: Plan) {
    const token = getToken()
    if (!token) {
      router.push("/login?redirect=/planes")
      return
    }
    setSelectedPlan(plan)
    setPurchaseStatus(null)
    setShowModal(true)
  }

  async function handleConfirmPurchase() {
    if (!selectedPlan || !user) return
    setPurchasing(true)
    setPurchaseStatus(null)

    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/memberships/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          planId: selectedPlan.id,
        }),
      })

      if (res.ok) {
        setPurchaseStatus({ type: "success", message: "Plan adquirido exitosamente. ¡Bienvenido a Weincard!" })
        await fetchUser()
      } else {
        const err = await res.json().catch(() => ({}))
        setPurchaseStatus({
          type: "error",
          message: err?.message ?? "No se pudo completar la compra. Intenta de nuevo.",
        })
      }
    } catch {
      setPurchaseStatus({ type: "error", message: "Error de conexión. Intenta de nuevo." })
    } finally {
      setPurchasing(false)
    }
  }

  const formatCOP = (value: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const hasMembership =
    user?.membership?.status === "active" || user?.membership?.status === "ACTIVE"

  return (
    <main className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <a href="/">
            <img src="/logo-weincard.png" alt="Weincard" className="h-4 md:h-6" />
          </a>
          <nav className="flex gap-4 text-xl font-extralight font-hepta-slab text-white">
            <a href="/catalogo" className="hover:opacity-70 transition">RESTAURANTES</a>
            <span>|</span>
            <a href="/planes" className="hover:opacity-70 transition">PLANES</a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="font-clash font-bold text-4xl md:text-5xl text-black mb-4">
            Elige tu plan
          </h1>
          <p className="font-hepta-slab text-gray-600 text-lg max-w-xl mx-auto">
            Accede a descuentos exclusivos en los mejores restaurantes con tu membresía Weincard.
          </p>
        </div>

        {/* Active membership banner */}
        {!loadingUser && hasMembership && (
          <div className="mb-10 rounded-2xl bg-black text-white px-6 py-5 flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div>
              <p className="font-clash font-bold text-lg">
                Tienes una membresía activa: {user?.membership?.planName ?? "Plan activo"}
              </p>
              {user?.membership?.expiresAt && (
                <p className="text-sm text-white/70 mt-1">
                  Vigente hasta:{" "}
                  {new Date(user.membership.expiresAt).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
            <span className="inline-block bg-[#FF3B47] text-white text-sm font-bold font-clash px-4 py-1.5 rounded-full">
              ACTIVA
            </span>
          </div>
        )}

        {/* Plans grid */}
        {loadingPlans ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-hepta-slab text-lg">
            No hay planes disponibles por el momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => {
              const isHighlighted = i === 1
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl flex flex-col overflow-hidden border transition-all ${
                    isHighlighted
                      ? "bg-black text-white border-black shadow-2xl scale-105"
                      : "bg-white text-black border-gray-200 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isHighlighted && (
                    <div className="bg-[#FF3B47] text-white text-xs font-clash font-bold text-center py-2 tracking-widest">
                      RECOMENDADO
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-1">
                    <h2 className={`font-clash font-bold text-2xl mb-2 ${isHighlighted ? "text-white" : "text-black"}`}>
                      {plan.name}
                    </h2>
                    <p className={`font-hepta-slab text-sm mb-6 leading-relaxed ${isHighlighted ? "text-white/70" : "text-gray-500"}`}>
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <span className={`font-clash font-bold text-4xl ${isHighlighted ? "text-white" : "text-black"}`}>
                        {formatCOP(plan.price)}
                      </span>
                      <span className={`text-sm ml-2 font-hepta-slab ${isHighlighted ? "text-white/60" : "text-gray-400"}`}>
                        / {plan.durationDays} días
                      </span>
                    </div>

                    {plan.features && plan.features.length > 0 && (
                      <ul className="flex flex-col gap-2 mb-8 flex-1">
                        {plan.features.map((f, fi) => (
                          <li key={fi} className={`flex items-start gap-2 text-sm font-hepta-slab ${isHighlighted ? "text-white/80" : "text-gray-600"}`}>
                            <span className="mt-0.5 text-[#FF3B47] font-bold flex-shrink-0">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`mt-auto w-full py-3 rounded-xl font-clash font-bold text-sm transition ${
                        isHighlighted
                          ? "bg-[#FF3B47] text-white hover:bg-[#e02e3a]"
                          : "bg-black text-white hover:bg-black/80"
                      }`}
                    >
                      {hasMembership ? "Cambiar a este plan" : "Adquirir plan"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
            <button
              onClick={() => { setShowModal(false); setPurchaseStatus(null) }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            {purchaseStatus?.type === "success" ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-clash font-bold text-xl text-black mb-2">Plan adquirido</h3>
                <p className="font-hepta-slab text-gray-500 text-sm">{purchaseStatus.message}</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 w-full py-3 rounded-xl bg-black text-white font-clash font-bold text-sm hover:bg-black/80 transition"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-clash font-bold text-2xl text-black mb-1">Confirmar compra</h3>
                <p className="font-hepta-slab text-gray-500 text-sm mb-6">
                  Estás a punto de adquirir el siguiente plan:
                </p>

                <div className="rounded-xl bg-[#F5F1E8] p-5 mb-6 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-hepta-slab text-sm text-gray-600">Plan</span>
                    <span className="font-clash font-bold text-black">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-hepta-slab text-sm text-gray-600">Duración</span>
                    <span className="font-clash font-bold text-black">{selectedPlan.durationDays} días</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-300 pt-3 mt-1">
                    <span className="font-hepta-slab text-sm text-gray-600">Total</span>
                    <span className="font-clash font-bold text-xl text-black">{formatCOP(selectedPlan.price)}</span>
                  </div>
                </div>

                {purchaseStatus?.type === "error" && (
                  <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-hepta-slab">
                    {purchaseStatus.message}
                  </div>
                )}

                <button
                  onClick={handleConfirmPurchase}
                  disabled={purchasing}
                  className="w-full py-3 rounded-xl bg-[#FF3B47] text-white font-clash font-bold text-sm hover:bg-[#e02e3a] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {purchasing && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {purchasing ? "Procesando..." : "Confirmar y pagar"}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full py-3 rounded-xl border border-gray-200 text-black font-hepta-slab text-sm hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
