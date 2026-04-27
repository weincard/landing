"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { API_BASE_QAS } from "@/lib/api"

interface RedemptionCode {
  redemptionCodeId?: number
  code?: string
  user?: { userId?: number; name?: string; phone?: string | null }
  branch?: { branchId?: number; name?: string }
  totalPaid?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

type StatusType = "success" | "used" | "not_found" | "error" | null

interface StatusState {
  type: StatusType
  message: string
  redemptionCode?: RedemptionCode
}

/** Separa el indicativo +57 del resto del número (E.164 Colombia). */
function splitDialAndNational(
  phone: string | null | undefined
): { dial: string; national: string } | null {
  if (!phone?.trim()) return null
  const n = phone.replace(/\s/g, "")
  if (n.startsWith("+57")) {
    const national = n.slice(3)
    return national ? { dial: "+57", national } : null
  }
  if (/^57\d/.test(n)) {
    const national = n.slice(2)
    return national ? { dial: "+57", national } : null
  }
  return { dial: "", national: n }
}

function StatusIcon({ type }: { type: StatusType }) {
  if (type === "success") {
    return (
      <svg
        className="h-5 w-5 text-green-600 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
  if (type === "used") {
    return (
      <svg
        className="h-5 w-5 text-yellow-600 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
        />
      </svg>
    )
  }
  if (type === "not_found" || type === "error") {
    return (
      <svg
        className="h-5 w-5 text-red-600 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  }
  return null
}

function StatusAlert({ status }: { status: StatusState }) {
  const bgMap: Record<string, string> = {
    success: "bg-green-50 border-green-200 text-green-800",
    used: "bg-yellow-50 border-yellow-200 text-yellow-800",
    not_found: "bg-red-50 border-red-200 text-red-800",
    error: "bg-red-50 border-red-200 text-red-800",
  }

  const colorClass = status.type ? bgMap[status.type] : ""

  return (
    <div
      className={`rounded-lg border p-4 ${colorClass} animate-in fade-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <StatusIcon type={status.type} />
        <div className="flex-1">
          <p className="font-medium">{status.message}</p>
        </div>
      </div>
    </div>
  )
}

function RedemptionDetails({ data }: { data: RedemptionCode }) {
  const formatCOPValue = (value?: number) => {
    if (value == null) return "-"
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const phoneParts = splitDialAndNational(data.user?.phone)
  const celularValue =
    phoneParts != null ? (
      <span className="inline-flex flex-wrap items-center gap-x-3 tabular-nums">
        {phoneParts.dial ? (
          <>
            <span>{phoneParts.dial}</span>
            <span className="text-[#1b5e20]/35 select-none" aria-hidden="true">
              ·
            </span>
          </>
        ) : null}
        <span>{phoneParts.national}</span>
      </span>
    ) : (
      "-"
    )

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Código", value: data.code ?? "-" },
    ...(data.totalPaid != null && data.totalPaid > 0
      ? [{ label: "Total de la cuenta", value: formatCOPValue(data.totalPaid) }]
      : []),
    { label: "Sucursal", value: data.branch?.name ?? "-" },
    { label: "Usuario", value: data.user?.name ?? "-" },
    { label: "Celular", value: celularValue },
  ]

  return (
    <div className="mt-4 rounded-lg border border-[#b2dfdb] bg-[#e8f5e9] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#b2dfdb]">
        <h3 className="font-clash font-bold text-[#1b5e20] text-sm">Detalles del codigo</h3>
      </div>
      <div className="divide-y divide-[#c8e6c9]">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center px-5 py-3 gap-4">
            <span className="text-sm font-bold text-[#2e7d32] min-w-[160px] flex-shrink-0">{label}</span>
            <div className="text-sm text-[#1b5e20]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function VerificacionQasPage() {
  const [formData, setFormData] = useState({
    code: "",
    totalPaid: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<StatusState>({ type: null, message: "" })

  const parseCOP = (formatted: string): string =>
    formatted.replace(/\./g, "").replace(/,/g, "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "totalPaid") {
      const digits = value.replace(/\D/g, "")
      const display = digits ? Number(digits).toLocaleString("es-CO") : ""
      setFormData((prev) => ({ ...prev, [name]: display }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: null, message: "" })

    const paidRaw = parseCOP(formData.totalPaid)
    const body: { code: string; totalPaid?: number } = {
      code: formData.code.trim(),
    }
    if (paidRaw) {
      body.totalPaid = Number(paidRaw)
    }

    try {
      const res = await fetch(
        `${API_BASE_QAS}/redemptions/codes/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )

      if (res.status === 201) {
        const data = await res.json()
        setStatus({
          type: "success",
          message: "Codigo verificado y actualizado.",
          redemptionCode: data.redemptionCode ?? data,
        })
        setFormData({ code: "", totalPaid: "" })
      } else if (res.status === 400) {
        setStatus({ type: "used", message: "El codigo ya fue usado." })
      } else if (res.status === 404) {
        setStatus({ type: "not_found", message: "Codigo no encontrado." })
      } else {
        setStatus({ type: "error", message: "Error inesperado, intenta nuevamente." })
      }
    } catch {
      setStatus({ type: "error", message: "Error inesperado, intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <header className="bg-black py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo-weincard.png"
              alt="Weincard Logo"
              width={150}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <span className="text-xs font-bold tracking-widest text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 uppercase">
            QAS
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-clash font-bold text-3xl md:text-4xl text-gray-900">
              Verificación de código
            </h1>
          </div>
          <p className="text-gray-500 text-sm mb-1">
            Entorno:{" "}
            <span className="font-semibold text-yellow-600">QAS (pruebas)</span>
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Digite el código único del usuario para validar el beneficio WEINCARD.
          </p>

          {/* Status Alert */}
          {status.type && (
            <div className="mb-6">
              <StatusAlert status={status} />
              {status.type === "success" && status.redemptionCode && (
                <RedemptionDetails data={status.redemptionCode} />
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="code"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
                placeholder="Ingresa el código"
              />
            </div>

            {/* Total Paid */}
            <div>
              <label htmlFor="totalPaid" className="block text-sm font-medium text-gray-700 mb-2">
                Total pagado
              </label>
              <input
                type="text"
                id="totalPaid"
                name="totalPaid"
                inputMode="numeric"
                value={formData.totalPaid}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="$ 0"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || !formData.code}
                className="w-full bg-[#FF3B47] hover:bg-[#FF3B47]/90 text-white py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Spinner />
                    Verificando...
                  </span>
                ) : (
                  "Verificar código"
                )}
              </Button>
            </div>
          </form>

          {/* Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              {"Necesitas ayuda? Contacta con nuestro equipo en "}
              <a href="mailto:weincardco@gmail.com" className="text-[#FF3B47] hover:underline">
                weincardco@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">{"© 2026 Weincard. Todos los derechos reservados."}</p>
        </div>
      </footer>
    </div>
  )
}
