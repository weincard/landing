"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface RedemptionCode {
  [key: string]: unknown
}

type StatusType = "success" | "used" | "not_found" | "error" | null

interface StatusState {
  type: StatusType
  message: string
  redemptionCode?: RedemptionCode
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
  return (
    <div className="mt-4 rounded-lg border border-green-200 bg-green-50/50 overflow-hidden">
      <div className="bg-green-100/60 px-4 py-3 border-b border-green-200">
        <h3 className="font-clash font-bold text-green-900 text-sm">Detalles del codigo</h3>
      </div>
      <div className="divide-y divide-green-100">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-start px-4 py-3 gap-4">
            <span className="text-sm font-medium text-green-700 min-w-[140px] flex-shrink-0">{key}</span>
            <span className="text-sm text-green-900 break-all">
              {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "-")}
            </span>
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

export default function VerificacionPage() {
  const [formData, setFormData] = useState({
    identification: "",
    code: "",
    totalPaid: "",
    totalDiscount: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<StatusState>({ type: null, message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: null, message: "" })

    const body = {
      identification: formData.identification.trim(),
      code: formData.code.trim(),
      totalPaid: Number(formData.totalPaid),
      totalDiscount: formData.totalDiscount ? Number(formData.totalDiscount) : 0,
    }

    try {
      const res = await fetch(
        "https://azucq9v6zc.execute-api.us-east-1.amazonaws.com/prod/redemptions/codes/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )

      if (res.status === 200) {
        const data = await res.json()
        setStatus({
          type: "success",
          message: "Codigo verificado y actualizado.",
          redemptionCode: data.redemptionCode ?? data,
        })
        setFormData({ identification: "", code: "", totalPaid: "", totalDiscount: "" })
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
        <div className="container mx-auto px-4">
          <Link href="/">
            <Image
              src="/logo-weincard.png"
              alt="Weincard Logo"
              width={150}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="font-clash font-bold text-3xl md:text-4xl mb-2 text-gray-900">
            Verificación de código
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Digite la cédula y el código único del usuario para validar el beneficio WEINCARD.
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
            {/* Identification */}
            <div>
              <label htmlFor="identification" className="block text-sm font-medium text-gray-700 mb-2">
                Identificación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="identification"
                name="identification"
                required
                value={formData.identification}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
                placeholder="Numero de identificacion"
              />
            </div>

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
                placeholder="Ingresa el codigo"
              />
            </div>

            {/* Total Paid */}
            <div>
              <label htmlFor="totalPaid" className="block text-sm font-medium text-gray-700 mb-2">
                Total Pagado <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="totalPaid"
                name="totalPaid"
                required
                min="0"
                step="any"
                value={formData.totalPaid}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
                placeholder="0"
              />
            </div>

            {/* Total Discount */}
            <div>
              <label htmlFor="totalDiscount" className="block text-sm font-medium text-gray-700 mb-2">
                Descuento Total <span className="text-gray-400 text-xs font-normal">(opcional)</span>
              </label>
              <input
                type="number"
                id="totalDiscount"
                name="totalDiscount"
                min="0"
                step="any"
                value={formData.totalDiscount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3B47] focus:border-transparent outline-none transition"
                placeholder="0"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || !formData.identification || !formData.code || !formData.totalPaid}
                className="w-full bg-[#FF3B47] hover:bg-[#FF3B47]/90 text-white py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
